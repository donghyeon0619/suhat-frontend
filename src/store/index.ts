import {createStore} from "vuex";
import participantsModule, {ParticipantsState} from "@/store/modules/participants";

export interface RootState{
  participants: ParticipantsState;
}



const store = createStore<RootState>({
  modules:{
    participants: participantsModule,
  },
})
export default store;