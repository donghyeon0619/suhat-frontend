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
import GameHome from "@/views/game/GameHome.vue";
import TypeTestPage from "@/views/typetest/TypeTestPage.vue";
import TypeTestResult from "@/views/typetest/TypeTestResult.vue";
import TypeTestSummary from "@/views/typetest/TypeTestSummary.vue";
import HomePage from "@/views/home/HomePage.vue";
import GameWaiting from "@/views/game/GameWaiting.vue";
import GameRoomScanner from "@/views/game/GameRoomScanner.vue";
import {getSessionId} from "@/store/secureStorage";
import SoloGameIntro from "@/views/game/solo/SoloGameIntro.vue";
import SoloGamePlay from "@/views/game/solo/SoloGamePlay.vue";
import PuzzleCompletion from "@/views/game/PuzzleCompletion.vue";
import GameRanking from "@/views/game/multiplayer/GameRanking.vue";
import MultiGamePlayView from "@/views/game/multiplayer/MultiGamePlayView.vue";
import TestView from "@/views/TestView.vue"
import GameTutorial from "@/views/game/tutorial/GameTutorial.vue";
import {getJSessionId} from "@/api/httpService";

const routes: Array<RouteRecordRaw> = [
    {
      path:'/',
      redirect: '/home'
    },
    {
        path: '/home',
        name: 'HomePage',
        component: HomePage,
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
      path: '/game/home',
      name: 'GameHome',
      component:GameHome
    },
    {
        path: '/game/waiting',
        name: 'GameWaiting',
        component:GameWaiting,
        props: true
    },
    {
        path: '/game/join',
        name: 'GameRoomScanner',
        component:GameRoomScanner
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
    path: '/multi/play',
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

// 전역 네비게이션 가드 실행
router.beforeEach(async (to, from, next)=>{
  const sessionId = await getSessionId();

  // /home 경로에 접근하려고 할 때 세션이 없으면 /loginTerms로 리다이렉트
  if ((to.path === "/" || to.path === "/home") && !sessionId ) {
    console.log("세션 정보 없음")
    next('/loginTerms'); // 세션이 없으면 로그인 동의 화면으로 이동
  } else {
    console.log("세션 정보", sessionId)
    next(); // 세션이 있으면 정상적으로 진행
  }
})

export default router
