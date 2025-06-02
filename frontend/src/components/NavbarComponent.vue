<template>
    <nav class="navbar">
        <div class="navbar-left">
            <img src="@/assets/logo.png" alt="Logo" class="logo" />
            <span class="site-name">ChargerHUB</span>
        </div>
        <div class="navbar-right">
            <div class="profile-container" @click="toggleDropdown">
                <img src="https://img.icons8.com/?id=98957&format=png&color=000000" alt="User" class="user-icon" />
                <div v-if="dropdownOpen" class="dropdown">
                    <div class="user-info">
                        <p><strong>Name:</strong> {{ user?.username }}</p>
                        <p><strong>Email:</strong> {{ user?.email }}</p>
                        <p><strong>Role:</strong> {{ user?.role }}</p>
                    </div>
                    <button @click="logout" class="logout-btn">Logout</button>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    name: 'NavbarComponent',
    data() {
        return {
            dropdownOpen: false,
            user: null
        };
    },
    mounted() {
        // Get user from cookies
        // const userCookie = document.cookie
        //     .split('; ')
        //     .find(row => row.startsWith('user='));
        // if (userCookie) {
        try {
            this.user = JSON.parse(localStorage.getItem('user') || '{}');
            if (!this.user || !this.user.username) {
                throw new Error('User data is not valid');
            }
        } catch (e) {
            this.user = null;
            alert("unable to find user data")
        }
    },
    methods: {
        toggleDropdown() {
            this.dropdownOpen = !this.dropdownOpen;
        },
        logout() {
            // Remove cookies
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            this.dropdownOpen = false;
            this.$router.push('/login');
        }
    }
};
</script>

<style scoped>
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #2c3e50;
    color: #fff;
    padding: 0 32px;
    height: 64px;
    box-shadow: 0 2px 8px rgba(44, 62, 80, 0.08);
    z-index: 999;
}

.navbar-left {
    display: flex;
    align-items: center;
}

.logo {
    margin:-30px;
    width: 100px;
    height: 100px;
    /* margin-right: 1px; */
}

.site-name {
    font-size: 1.6rem;
    font-weight: bold;
    letter-spacing: 1px;
}

.navbar-right {
    position: relative;
}

.profile-container {
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;
}

.user-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid #2980b9;
    object-fit: cover;
    padding:5px
}

.dropdown {
    position: absolute;
    right: 0;
    top: 48px;
    background: #fff;
    color: #2c3e50;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(44, 62, 80, 0.12);
    min-width: 200px;
    z-index: 999;
    padding: 16px;
}

.user-info {
    margin-bottom: 12px;
    font-size: 1rem;
}

.logout-btn {
    width: 100%;
    padding: 8px 0;
    background: #e74c3c;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s;
}

.logout-btn:hover {
    background: #c0392b;
}
</style>
