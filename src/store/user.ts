import { defineStore } from 'pinia';

export interface UserState {
  id: number | null;
  name: string;
  gender: number | null;
  schoolType: number | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    id: localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null,
    name: localStorage.getItem('name') || '',
    gender: localStorage.getItem('gender') ? Number(localStorage.getItem('gender')) : null,
    schoolType: localStorage.getItem('schoolType') ? Number(localStorage.getItem('schoolType')) : null,
  }),
  getters: {
    userInfo: (state): UserState => ({
      id: state.id,
      name: state.name,
      gender:state.gender,
      schoolType:state.schoolType,
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
    setSchoolType(schoolType: number) {
      this.schoolType = schoolType;
      localStorage.setItem('schoolType', JSON.stringify(schoolType));
    },
    resetUserInfo() {
      this.id = null;
      this.name = '';
      this.gender = null;
      this.schoolType = null;

      localStorage.removeItem('userId');
      localStorage.removeItem('name');
      localStorage.removeItem('gender');
      localStorage.removeItem('schoolType');
    },
  },
});