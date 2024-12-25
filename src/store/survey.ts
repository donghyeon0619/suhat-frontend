import {defineStore} from "pinia";

// SurveyState 인터페이스 정의
interface SurveyState {
  latestScore: number | null;
}

export const useSurveyStore = defineStore('survey', {
  state: (): SurveyState => ({
    latestScore: 0,
  }),
  actions: {
    setLatestScore(score: number | null){
      this.latestScore = score;
    }
  },
  getters: {
    getLatestScore: (state) => state.latestScore
  },
})