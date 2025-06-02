<template>
  <router-view />
</template>

<script>

export default {
  name: 'App',
  async mounted() {

    const token = localStorage.getItem('token');
    if (!token) {
      this.$router.replace('/login');
      return;
    }
    try {
      const response = await fetch('https://charging-stations-crud.vercel.app/check', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!data.ok) {
        this.$router.replace('/login');
      }
    } catch (e) {
      this.$router.replace('/login');
    }

  },
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
