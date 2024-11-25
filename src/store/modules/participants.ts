import { Module } from "vuex";
import { RootState } from "@/store"; // 루트 스토어 타입 가져오기

export interface Participant {
  name: string;
  order: number;
  currentPieces: number;
}

export interface ParticipantsState {
  participants: Participant[];
  currentSpeaker: string;
  currentPhase: number;
}

const participantsModule: Module<ParticipantsState, RootState> = {
  namespaced: true,
  state: {
    participants: [
      { name: "이예지", order: 1, currentPieces: 0 },
      { name: "김루리", order: 2, currentPieces: 1 },
      { name: "박성호", order: 3, currentPieces: 2 },
      { name: "이윤호", order: 4, currentPieces: 3 },
    ],
    currentSpeaker: "이예지", // 초기 발언자
    currentPhase: 1, // 초기 상태
  },
  mutations: {
    setParticipants(state, participants: Participant[]) {
      state.participants = participants;
    },
    setCurrentSpeaker(state, speaker: string) {
      state.currentSpeaker = speaker;
    },
    setCurrentPhase(state, phase: number) {
      state.currentPhase = phase;
    },
  },
  actions: {
    initializeParticipants({ commit }) {
      const dummyData: Participant[] = [
        { name: "이예지", order: 1, currentPieces: 0 },
        { name: "김루리", order: 2, currentPieces: 1 },
        { name: "박성호", order: 3, currentPieces: 2 },
        { name: "이윤호", order: 4, currentPieces: 3 },
      ];
      commit("setParticipants", dummyData);
    },
    updateSpeaker({ commit }, speaker: string) {
      commit("setCurrentSpeaker", speaker);
    },
    updatePhase({ commit }, phase: number) {
      commit("setCurrentPhase", phase);
    },
  },
  getters: {
    participants: (state) => state.participants,
    currentSpeaker: (state) => state.currentSpeaker,
    currentPhase: (state) => state.currentPhase,
  },
};

export default participantsModule;