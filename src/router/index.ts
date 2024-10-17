import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import path from "path";
import LoginName from "@/views/auth/LoginName.vue";
import LoginTerms from "@/views/auth/LoginTerms.vue";
import LoginGender from "@/views/auth/LoginGender.vue";
import LoginFinish from "@/views/auth/LoginFinish.vue";
import LoginSchool from "@/views/auth/LoginSchool.vue";
import Onboarding from "@/views/intro/Onboarding.vue";
import Splash from "@/views/intro/Splash.vue";
import SurveyPage from "@/views/survey/SurveyPage.vue";
import SurveyResult from "@/views/survey/SurveyResult.vue";
import TypeTestPage from "@/views/typetest/TypeTestPage.vue";
import TypeTestResult from "@/views/typetest/TypeTestResult.vue";
import TypeTestSummary from "@/views/typetest/TypeTestSummary.vue";

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
    name: 'LoginName',
    component: LoginName
  },
  {
    path:'/loginTerms',
    name: 'LoginTerms',
    component:LoginTerms
  },
  {
    path:'/loginGender',
    name: 'LoginGender',
    component:LoginGender
  },
  {
    path:'/loginSchool',
    name: 'LoginSchool',
    component:LoginSchool
  },
 {
   path:'/loginFinish',
   name: 'LoginFinish',
   component:LoginFinish
  },
  {
    path:'/intro/onboarding',
    name: 'Onboadrding',
    component:Onboarding
  },
  {
    path:'/intro/splash',
    name:'Splash',
    component:Splash
  },
  {
    path: '/surveyPage',
    name: 'SurveyPage',
    component:SurveyPage
  },
  {
    path: '/surveyResult',
    name: 'SurveyResult',
    component:SurveyResult
  },
  {
    path: '/typeTestPage',
    name: 'TypeTestPage',
    component: TypeTestPage,
  },
  {
      path: '/typeTestResult',
      name: 'TypeTestResult',
      component: TypeTestResult,
  },
  {
    path: '/typeTestSummary',
    name: 'TypeTestSummary',
    component: TypeTestSummary,
  },

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
