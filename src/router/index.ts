import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import LoginName from "@/views/auth/LoginName.vue";
import LoginTerms from "@/views/auth/LoginTerms.vue";
import LoginGender from "@/views/auth/LoginGender.vue";
import LoginFinish from "@/views/auth/LoginFinish.vue";
import LoginSchool from "@/views/auth/LoginSchool.vue";
import GameHome from "@/views/game/GameHome.vue";
import HomePage from "@/views/home/HomePage.vue";
import {validateSession} from "@/api/sessionService";
import {useAppStateStore} from "@/store/appState";
import {useNetworkStore} from "@/store/network";
import {showAlert} from "@/utils/showAlert";
import SurveyPage from "@/views/survey/SurveyPage.vue";
import SurveyResult from "@/views/survey/SurveyResult.vue";

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
      component: () => import("@/views/intro/IntroOnboarding.vue"),
    },
    {
      path: '/surveyPage',
      name: 'SurveyPage',
      component: () => import("@/views/survey/SurveyPage.vue"),

    },
    {
      path: '/surveyResult',
      name: 'SurveyResult',
      component: () => import("@/views/survey/SurveyResult.vue"),
    },
    {
      path: '/game/home',
      name: 'GameHome',
      component:GameHome
    },
    {
        path: '/game/waiting/:roomId',
        name: 'GameWaiting',
        component: () => import("@/views/game/GameWaiting.vue"),
        props: true
    },
    {
        path: '/game/tutorial',
        name: 'GameTutorial',
        component: () => import("@/views/game/tutorial/GameTutorial.vue"),
    },
    {
        path: '/typeTestPage',
        name: 'TypeTestPage',
        component: () => import("@/views/typetest/TypeTestPage.vue"),
    },
    {
        path: '/typeTestResult',
        name: 'TypeTestResult',
        component: () => import("@/views/typetest/TypeTestResult.vue"),
    },
    {
        path: '/typeTestSummary',
        name: 'TypeTestSummary',
      component: () => import("@/views/typetest/TypeTestSummary.vue"),
    },
  {
    path: '/sologame/intro',
    name: 'SoloGameIntro',
    component: () => import("@/views/game/solo/SoloGameIntro.vue"),
  },
  {
    path: '/sologame/play',
    name: 'SoloGamePlay',
    component: () => import("@/views/game/solo/SoloGamePlay.vue"),
  },
  {
    path: '/puzzlecompletion',
    name: 'PuzzleCompletion',
    component: () => import("@/views/game/PuzzleCompletion.vue"),
  },
  {
    path: '/multi/ranking',
    name: 'GameRanking',
    component: () => import("@/views/game/multiplayer/GameRanking.vue"),
  },
  {
    path: '/multi/play/:roomId',
    name: 'MultiGamePlay',
    component: () => import("@/views/game/multiplayer/MultiGamePlayView.vue"),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from) => {
  const networkStore = useNetworkStore();
  if (!networkStore.isOnline) {
    await showAlert(
      "페이지 이동 오류",
      "네트워크 활성화 후 페이지 이동을 해주세요",
      [{
        text: "확인", role: "confirm",

      }], "custom-one-button-alert"
    );
    return false;
  }
});

export default router;
