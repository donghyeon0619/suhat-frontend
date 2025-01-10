import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import LoginName from "@/views/auth/LoginName.vue";
import LoginTerms from "@/views/auth/LoginTerms.vue";
import LoginGender from "@/views/auth/LoginGender.vue";
import LoginFinish from "@/views/auth/LoginFinish.vue";
import LoginSchool from "@/views/auth/LoginSchool.vue";
import Splash from "@/views/intro/Splash.vue";
import SurveyPage from "@/views/survey/SurveyPage.vue";
import SurveyResult from "@/views/survey/SurveyResult.vue";
import GameHome from "@/views/game/GameHome.vue";
import TypeTestPage from "@/views/typetest/TypeTestPage.vue";
import TypeTestResult from "@/views/typetest/TypeTestResult.vue";
import TypeTestSummary from "@/views/typetest/TypeTestSummary.vue";
import HomePage from "@/views/home/HomePage.vue";
import GameWaiting from "@/views/game/GameWaiting.vue";
import SoloGameIntro from "@/views/game/solo/SoloGameIntro.vue";
import SoloGamePlay from "@/views/game/solo/SoloGamePlay.vue";
import PuzzleCompletion from "@/views/game/PuzzleCompletion.vue";
import GameRanking from "@/views/game/multiplayer/GameRanking.vue";
import MultiGamePlayView from "@/views/game/multiplayer/MultiGamePlayView.vue";
import TestView from "@/views/TestView.vue"
import GameTutorial from "@/views/game/tutorial/GameTutorial.vue";
import {validateSession} from "@/api/sessionService";
import {useAppStateStore} from "@/store/appState";
import {Network} from "@capacitor/network";

const routes: Array<RouteRecordRaw> = [
    {
      path:'/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'HomePage',
      component: HomePage,
      beforeEnter: async (to, from, next) =>{
        const appStateStore = useAppStateStore();
        if (!appStateStore.hasSeenOnBoarding){
          console.log("온보딩 화면으로 이동");
          return next('/intro/onboarding');
        }

        // 세션 유효성 검사
        const isValidSession = await validateSession();
        if (isValidSession) {
          console.log("세션 유효, 홈 화면으로 이동");
          return next();

        } else {
          console.log("세션 없음, 로그인 화면으로 이동");
           return next('/loginTerms');
        }
      }
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
      name: 'IntroOnboarding',
      component: () => import('@/views/intro/IntroOnboarding.vue')
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
      path: '/game/home',
      name: 'GameHome',
      component:GameHome
    },
    {
        path: '/game/waiting/:roomId',
        name: 'GameWaiting',
        component:GameWaiting,
        props: true
    },
    {
        path: '/game/tutorial',
        name: 'GameTutorial',
        component:GameTutorial
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
  {
    path: '/sologame/intro',
    name: 'SoloGameIntro',
    component: SoloGameIntro
  },
  {
    path: '/sologame/play',
    name: 'SoloGamePlay',
    component: SoloGamePlay,
  },
  {
    path: '/puzzlecompletion',
    name: 'PuzzleCompletion',
    component: PuzzleCompletion,
  },
  {
    path: '/multi/ranking',
    name: 'GameRanking',
    component: GameRanking,
  },
  {
    path: '/multi/play/:roomId',
    name: 'MultiGamePlay',
    component: MultiGamePlayView
  },
  {
    path: '/test',
    name: 'Test',
    component: TestView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
