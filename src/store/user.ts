import { defineStore } from 'pinia';

export interface UserState {
  id: string | null;
  name: string;
  gender: number | null;
  school: string;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    id: localStorage.getItem('userId'),
    name: localStorage.getItem('name') || '',
    gender: localStorage.getItem('gender') ? JSON.parse(localStorage.getItem('userGender')!) : null,
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
    setId(id: string) {
      this.id = id;
      localStorage.setItem('userId', id);
    },
    setName(name: string) {
      this.name = name;
      localStorage.setItem('name', name);
    },
    setGender(gender: number | null) {
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