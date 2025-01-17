import {defineStore} from "pinia";

export const useGameStore = defineStore("game",{
  state: () => ({
    isGameEnded: false, // 게임 종료 상태
  }),
  actions: {
    setGameEnded(status: boolean) {
      this.isGameEnded = status;
    },
  }
})