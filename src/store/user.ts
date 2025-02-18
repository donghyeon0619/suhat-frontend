import { defineStore } from 'pinia';

export interface UserState {
  id: number | null;
  name: string;
  gender: number | null;
  school: string;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    id: localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null,
    name: localStorage.getItem('name') || '',
    gender: localStorage.getItem('gender') ? Number(localStorage.getItem('gender')) : null,
    school: localStorage.getItem('school') || '',
  }),
  getters: {
    userInfo: (state): UserState => ({
      id: state.id,
      name: state.name,
      gender:state.gender,
      school:state.school,
    }),
  },
  actions: {
    setId(id: number) {
      this.id = id;
      localStorage.setItem('userId', JSON.stringify(id));
    },
    setName(name: string) {
      this.name = name;
      localStorage.setItem('name', name);
    },
    setGender(gender: number) {
      this.gender = gender;
      localStorage.setItem('gender', JSON.stringify(gender));
    },
    setSchool(school: string) {
      this.school = school;
      localStorage.setItem('school', school);
    },
    resetUserInfo() {
      this.id = null;
      this.name = '';
      this.gender = null;
      this.school = '';

      localStorage.removeItem('userId');
      localStorage.removeItem('name');
      localStorage.removeItem('gender');
      localStorage.removeItem('school');
    },
  },
});