import { defineStore } from 'pinia';

export interface UserState {
  name: string;
  gender: number | null;
  school: string;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    name: '',
    gender: null,
    school: '',
  }),
  getters: {
    userInfo: (state): UserState => ({
      name: state.name,
      gender:state.gender,
      school:state.school,
    }),
  },
  actions: {
    setName(name: string) {
      this.name = name;
    },
    setGender(gender: number | null) {
      this.gender = gender;
    },
    setSchool(school: string) {
      this.school = school;
    },
    resetUserInfo() {
      this.name = '';
      this.gender = null;
      this.school = '';
    },
  },
});