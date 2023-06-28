import { createRouter, createWebHistory } from 'vue-router'
import ActivitiesView from '../components/ActivitiesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:version',
      name: 'Activities',
      component: ActivitiesView
    },
    {
      path: '/:version/:id',
      name: 'activity',
      component: ActivitiesView
    }
  ]
})

export default router
