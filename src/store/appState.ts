import { defineStore} from "pinia";

/**
 * App 상태를 관리하는 Pinia 스토어.
 * - 온보딩 완료 여부
 * - 앱 전역 초기화 상태
 */

export const useAppStateStore = defineStore('appState', {
  state: () =>({
    hasSeenOnBoarding: false,
  }),
  actions: {
    markOnboardingComplete(){
      this.hasSeenOnBoarding = true;
    },

    resetOnboarding(){
      this.hasSeenOnBoarding = false;
    }
  },
  getters: {
    inOnboardingComplete: (state) => state.hasSeenOnBoarding
  }
})