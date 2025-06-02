<template>
    <v-app>
        <v-container fluid class="signup-wrapper">
            <div class="overlay"></div>

            <v-row class="fill-height" align="center" justify="center">
                <v-col cols="12" sm="10" md="6" lg="4">
                    <v-slide-y-transition>
                        <v-card elevation="10" class="pa-6 signup-card">
                            <!-- Logo + Gradient Brand Name -->
                            <AppLogo class="mb-6" />

                            <v-card-title class="text-h5 font-weight-bold mb-4 justify-center">
                                Create Your Account
                            </v-card-title>

                            <!-- Lottie Loader -->
                            <v-overlay :model-value="loading" contained class="d-flex align-center justify-center">
                                <LottieLoader />
                            </v-overlay>


                            <v-form @submit.prevent="handleSubmit" validate-on="submit lazy">
                                <v-text-field :disabled="loading" v-model="username" label="Username" prepend-inner-icon="mdi-account"
                                    variant="outlined" required class="mb-4" />

                                <v-text-field :disabled="loading" v-model="email" label="Email" type="email" prepend-inner-icon="mdi-email"
                                    variant="outlined" required class="mb-4" />

                                <v-text-field :disabled="loading" v-model="password" label="Password" type="password"
                                    prepend-inner-icon="mdi-lock" variant="outlined" required class="mb-4" />

                                <v-select :disabled="loading" v-model="role"
                                    :items="[{ title: 'User', value: 'user' }, { title: 'Admin', value: 'admin' }]"
                                    label="Role" prepend-inner-icon="mdi-account-group" variant="outlined" required
                                    class="mb-4" />

                                <v-btn type="submit" :color="success ? 'success' : 'primary'" block size="large"
                                    class="mb-3" :loading="loading && !success" :disabled="loading">
                                    <template #default>
                                        <v-icon v-if="success" left>mdi-check-circle</v-icon>
                                        <span v-if="!success">Sign Up</span>
                                        <span v-else>Success</span>
                                    </template>
                                </v-btn>


                                <v-alert v-if="error" type="error" density="compact" class="mb-2">
                                    {{ error }}
                                </v-alert>

                                <div class="text-center mt-2">
                                    <span class="text-body-2">Already have an account?</span>
                                    <router-link to="/login" class="text-primary">Sign In</router-link>
                                </div>
                            </v-form>
                        </v-card>
                    </v-slide-y-transition>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script>
import AppLogo from './AppLogo.vue';
import LottieLoader from '@/components/LottieLoader.vue';

export default {
    name: 'SignUp',
    components: {
        AppLogo,
        LottieLoader
    },
    data() {
        return {
            username: '',
            email: '',
            password: '',
            role: 'user',
            error: '',
            loading: false,
            success: false
        };
    },
    methods: {
        async handleSubmit() {
            this.error = '';
            this.loading = true;
            this.success = false;

            try {
                const response = await fetch('https://charging-stations-crud.vercel.app/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: this.username,
                        email: this.email,
                        password: this.password,
                        role: this.role
                    })
                });
                const data = await response.json();

                if (response.ok && data.token) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    localStorage.setItem('token', data.token);
                    document.cookie = `token=${data.token}; path=/;`;
                    document.cookie = `user=${encodeURIComponent(JSON.stringify(data.user))}; path=/;`;

                    this.success = true;

                    setTimeout(() => {
                        this.$router.push('/');
                    }, 1000);
                } else {
                    this.error = data.message || 'Signup failed';
                }
            } catch (err) {
                this.error = 'Network error';
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>



<style scoped>
.signup-wrapper {
    position: relative;
    background: url('https://cdn.leonardo.ai/users/c7cb238d-efb6-45e0-a57e-da66acc963bb/generations/8bea93a6-2cf6-4221-92a0-c0f33889478f/Leonardo_Phoenix_10_A_haunted_old_bus_floating_in_the_dark_nig_3.jpg') center/cover no-repeat;
    min-height: 100vh;
    overflow: hidden;
    padding: 16px;
}

.overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.55);
    z-index: 1;
}

.signup-card {
    position: relative;
    z-index: 2;
    backdrop-filter: blur(16px);
    background-color: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    color: white;
}

::v-deep .v-input__control {
    background-color: rgba(255, 255, 255, 0.1) !important;
    border-radius: 8px;
    color: white;
}

::v-deep input {
    color: white !important;
}

::v-deep .v-label {
    color: rgba(255, 255, 255, 0.7);
}

::v-deep .v-field__outline {
    border-color: rgba(255, 255, 255, 0.4);
}
</style>
