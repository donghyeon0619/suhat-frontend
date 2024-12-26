/**
 * 로그인 api 함수
 */
import {post} from "@/api/httpService";
import {useUserStore} from "@/store/user";
import {toRaw} from "vue";
import {setJSessionId} from "@/api/sessionService";

export async function signup(){
  const userStore = useUserStore();
  const userInfo = toRaw(userStore.userInfo);
  const response = await post('users/signup', userInfo);

  if (response){
    await setJSessionId(response);
    console.log("가입완료");
  }

  return response
}