import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import path from "path";
import LoginName from "@/views/auth/LoginName.vue";
import LoginTerms from "@/views/auth/LoginTerms.vue";
import LoginGender from "@/views/auth/LoginGender.vue";
import LoginFinish from "@/views/auth/LoginFinish.vue";
import LoginSchool from "@/views/auth/LoginSchool.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/tab1'
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1Page.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2Page.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3Page.vue')
      }
    ]
  },
  {
    path: '/loginName',
    component: LoginName
  },
  {
    path:'/loginTerms',
    component:LoginTerms
  },
  {
    path:'/loginGender',
    component:LoginGender
  },
  {
    path:'/loginSchool',
    component:LoginSchool
  },
 {
    path:'/loginFinish',
    component:LoginFinish
  },

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
