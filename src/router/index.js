import { createRouter, createWebHistory } from 'vue-router'
import CatList from '@views/CatList.vue'
import CatProfile from '@views/CatProfile.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'cat-list',
      component: CatList,
      meta: { title: 'Home' }
    },
    {
      path: '/cat/:id',
      name: 'cat-profile',
      component: CatProfile,
      meta: { title: 'Cat Profile' }
    }
  ]
})

export default router
