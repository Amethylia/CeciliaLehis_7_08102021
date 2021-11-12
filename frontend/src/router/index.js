import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import("../views/Login"),
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: () => import("../views/SignUp"),
  },
  {
    path: '/userprofile',
    name: 'UserProfile',
    component: () => import("../views/UserProfile"),
  },
  {
    path: '/newpost',
    name: 'NewPost',
    component: () => import("../views/NewPost"),
  },
  {
    path: '/posts',
    name: 'Posts',
    component: () => import("../views/Posts"),
  },
]

const router = new VueRouter({
  routes
})

export default router
