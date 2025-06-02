<template>
  <Vue3Lottie :animationData="animation" :height="150" :loop="true" />
</template>

<script setup>
import { Vue3Lottie } from 'vue3-lottie'
import animation from '@/assets/lottie-loading.json' // You can use your own

</script>
