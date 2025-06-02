import HomeComponent from '@/components/HomeComponent.vue'
import SignIn from '@/components/SignIn.vue'
import SignUp from '@/components/SignUp.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: SignIn
  },
  {
    path: '/signup',
    name: 'Signup',
    component: SignUp
  },
  {
    path: '/',
    name: 'Home',
    component: HomeComponent
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router