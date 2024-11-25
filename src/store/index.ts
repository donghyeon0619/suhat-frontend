import userModule, {UserState} from "@/store/modules/user";
import {createStore} from "vuex";
import participantsModule, {ParticipantsState} from "@/store/modules/participants";

export interface RootState{
  user: UserState;
  participants: ParticipantsState;
}



const store = createStore<RootState>({
  modules:{
    user: userModule,
    participants: participantsModule,
  },
})
export default store;