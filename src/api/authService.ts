/**
 * 로그인 api 함수
 */
import {post} from "@/api/httpService";
import {useUserStore} from "@/store/user";
import {toRaw} from "vue";
import {CapacitorCookies} from "@capacitor/core";
import {getJSessionId, setJSessionId} from "@/api/sessionService";

interface CookieOptions {
  value: string;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
  expires?: string;
}

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