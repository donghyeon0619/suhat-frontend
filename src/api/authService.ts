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

  try {
    const response = await post('users', userInfo);
    if (response){
      const { sessionId, userId } = response;
      userStore.setId(userId);

      await setJSessionId(sessionId);
    }
    return response;
  } catch (error) {
    console.error('회원가입 중 오류:', error);
    throw error
  }
}