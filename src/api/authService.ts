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
      const { session, userId } = response;
      userStore.setId(userId);

      await setJSessionId(session);
      // await syncCookies();

      console.log("쿠키 값", getJSessionId());
      console.log('회원가입 및 쿠키 동기화 성공');}
    return response
  } catch (error) {
    console.error('회원가입 중 오류:', error);
    throw error
  }
}

// async function syncCookies(url = 'https://suhat.kr') {
//   try{
//     const cookiesResponse = await CapacitorCookies.getCookies({url});
//
//     console.log('Raw Cookie Response:', JSON.stringify(cookiesResponse, null, 2));
//     console.log('Cookie Keys:', Object.keys(cookiesResponse));
//
//     // JSESSIONID에 특화된 동기화 로직
//     const jsessionCookie = Object.entries(cookiesResponse)
//       .find(([key]) => key.toLowerCase() === 'jsessionid');
//
//     if (jsessionCookie) {
//       const [key, value] = jsessionCookie;
//       const cookieString = `${key}=${value}; path=/; domain=suhat.kr; Secure; SameSite=None; HttpOnly`;
//
//       document.cookie = cookieString;
//
//       console.log(`동기화된 세션 쿠키: ${key}`);
//       console.log(`동기화된 쿠키 문자열: ${cookieString}`);
//       console.log('전체 document.cookie:', document.cookie);
//     } else {
//       console.warn('JSESSIONID 쿠키를 찾을 수 없습니다.');
//     }
//   } catch (error) {
//     console.error('쿠키 동기화 오류', error);
//     console.log('쿠키 동깋라ㅗ 오류 ', error);
//   }
// }