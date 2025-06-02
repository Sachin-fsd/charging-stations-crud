<template>
    <div class="logo-container d-flex align-center justify-center">
        <v-img src="/logo.png" alt="ChargerHUB Logo" max-width="88" max-height="88" class="me-3 logo-img" />
        <span class="logo-text">
            Charger<span class="hub-part">HUB</span>
        </span>
    </div>
</template>

<script setup>
</script>

<style scoped>
.logo-text {
    font-size: 1.8rem;
    font-weight: 700;
    background: linear-gradient(90deg, #00bcd4, #4caf50);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
    transition: transform 0.3s ease;
}

.hub-part {
    background: linear-gradient(90deg, #ff8a65, #f44336);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

.logo-container:hover .logo-text {
    transform: scale(1.05);
}

.logo-img {
    transition: transform 0.3s ease;
}

.logo-container:hover .logo-img {
    transform: rotate(-5deg) scale(1.05);
}
</style>
