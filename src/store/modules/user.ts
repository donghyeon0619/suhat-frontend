import {Module} from "vuex";

export interface UserState {
  name: string;
  gender: number | null;
  school: string;
}


const userModule: Module<UserState, any> = {
  namespaced: true,
  state: {
    name: '',
    gender: null,
    school: ''
  },
  mutations: {
    setName(state, name: string) {
      state.name = name;
    },
    setGender(state, gender: number | null) {
      state.gender = gender;
    },
    setSchool(state, school: string) {
      state.school = school;
    },
    resetUserInfo(state) {
      state.name = "";
      state.gender = null;
      state.school = "";
    },
  },
  actions: {
    setName({ commit }, name: string) {
      commit("setName", name);
    },
    setGender({ commit }, gender: number | null) {
      commit("setGender", gender);
    },
    setSchool({ commit }, school: string) {
      commit("setSchool", school);
    },
    resetUserInfo({ commit }) {
      commit("resetUserInfo");
    },
  },
  getters: {
    userInfo: (state) => state,
  },
}

export default userModule