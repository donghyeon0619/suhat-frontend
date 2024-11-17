import userModule, {UserState} from "@/store/modules/user";
import {createStore} from "vuex";

export interface RootState{
  user: UserState
}

const store = createStore<RootState>({
  modules:{
    user: userModule
  },
})
export default store;