import {defineStore} from "pinia";

export enum RoomStatus {
  WAITING = 'WAITING',
  IN_GAME = 'IN_GAME',
  ENDED = 'ENDED',
  CLOSED = 'CLOSED',
}

export const useGameStore = defineStore("game",{
  state: () => ({
    roomStatus: RoomStatus.WAITING as RoomStatus,

  }),
  actions: {
    setGameEnded(status: RoomStatus) {
      this.roomStatus = status;
    },
  }
})