<template>
  <v-app>
    <v-container fluid class="login-wrapper">
      <!-- Dark overlay -->
      <div class="overlay"></div>

      <v-row class="fill-height" align="center" justify="center">
        <v-col cols="12" sm="10" md="6" lg="4">
          <v-slide-y-transition>
            <v-card elevation="10" class="pa-6 login-card">
              <!-- Logo -->
              <AppLogo class="mb-6" />

              <v-card-title class="text-h5 font-weight-bold mb-4 justify-center">
                Welcome Back
              </v-card-title>

              <v-form @submit.prevent="handleSubmit" validate-on="submit lazy">
                <v-text-field v-model="email" label="Email" type="email" variant="outlined"
                  prepend-inner-icon="mdi-email" required class="mb-4" />

                <v-text-field v-model="password" label="Password" type="password" variant="outlined"
                  prepend-inner-icon="mdi-lock" required class="mb-4" />

                <v-btn type="submit" color="primary" block size="large" class="mb-3">
                  Sign In
                </v-btn>

                <v-alert v-if="error" type="error" density="compact" class="mb-2">
                  {{ error }}
                </v-alert>

                <div class="text-center mt-2">
                  <span class="text-body-2">Don't have an account?</span>
                  <router-link to="/signup" class="text-primary">Sign Up</router-link>
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

export default {
  name: 'SignIn',
  components: {
    AppLogo
  },
  data() {
    return {
      email: '',
      password: '',
      error: ''
    };
  },
  methods: {
    async handleSubmit() {
      this.error = '';
      try {
        const response = await fetch('https://charging-stations-crud.vercel.app/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        });
        const data = await response.json();
        console.log("response", response)
        console.log("data", data)
        if (response.ok && data.token) {
          // Save token and user in cookies
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          // Set cookies for token and user
          document.cookie = `token=${data.token}; path=/;`;
          document.cookie = `user=${encodeURIComponent(JSON.stringify(data.user))}; path=/;`;
          this.$router.push('/');
        } else {
          this.error = data.message || 'Login failed';
        }
      } catch (err) {
        this.error = 'Network error';
      }
    }
  }
};
</script>

<style scoped>
.login-wrapper {
  position: relative;
  background: url('https://cdn.leonardo.ai/users/c7cb238d-efb6-45e0-a57e-da66acc963bb/generations/8bea93a6-2cf6-4221-92a0-c0f33889478f/Leonardo_Phoenix_10_A_haunted_old_bus_floating_in_the_dark_nig_3.jpg') center/cover no-repeat;
  min-height: 100vh;
  overflow: hidden;
  padding: 16px;
}

/* dark overlay */
.overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.55);
  z-index: 1;
}

/* glassmorphic card */
.login-card {
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