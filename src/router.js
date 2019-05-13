import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/auth/Login.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: 'login',
      name: 'homepage'
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },

    {
      path: '/home',
      name: 'home',
      component: Home
    }
  ]
})
