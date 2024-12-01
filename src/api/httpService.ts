import {CapacitorHttp, HttpOptions, CapacitorCookies} from '@capacitor/core';
import {useIonRouter, alertController} from "@ionic/vue";
// import {getSessionId} from "@/store/secureStorage";

const BASE_URL = 'http://localhost:8080/api/';

// **쿠키 관리 함수**
/**
 * JSESSIONID 설정하기
 */
async function setJSessionId(jsessionId: string) {
  await CapacitorCookies.setCookie({
    url: BASE_URL, // 백엔드 URL
    key: 'JSESSIONID',
    value: jsessionId,
    path: '/', // Spring Security 기본 경로
  });
}

/**
 * JSESSIONID 가져오기
 */
async function getJSessionId(): Promise<string | null> {
  const result = await CapacitorCookies.getCookies({url: BASE_URL});
  const cookies = result.cookies as unknown as { [key: string]: string }; // unknown으로 변환 후 캐스팅
  return cookies['JSESSIONID'] || null; // JSESSIONID 가져오기
}

/**
 * JSESSIONID 삭제하기
 */
async function deleteJSessionId() {
  await CapacitorCookies.deleteCookie({
    url: BASE_URL,
    key: 'JSESSIONID',
  });
}

// **HTTP 요청 함수**

/**
 * 공통 HTTP 옵션 생성
 */
async function getHttpOptions(
  endpoint: string,
  method: 'GET' | 'POST',
  data?: any,
  params?: any
): Promise<HttpOptions> {
  return {
    url: `${BASE_URL}${endpoint}`,
    headers: {
      'Content-Type': 'application/json',
    },
    params: params || undefined,
    data: data || undefined,
    method,
  };
}

/**
 * GET 요청
 */
export async function get(endpoint: string, params?: any): Promise<any> {
  const options = await getHttpOptions(endpoint, 'GET', undefined, params);

  // 쿠키 전송 활성화
  options.webFetchExtra = {
    credentials: 'include', // 쿠키 포함 설정
  };

  try {
    const response = await CapacitorHttp.get(options);
    return response.data;
  } catch (error: any) {
    await handleErrorResponse(error);
  }
}

/**
 * POST 요청
 */
export async function post(endpoint: string, data: any): Promise<any> {
  const options = await getHttpOptions(endpoint, 'POST', data);

  // 쿠키 전송 활성화
  options.webFetchExtra = {
    credentials: 'include', // 쿠키 포함 설정
  };

  try {
    const response = await CapacitorHttp.post(options);
    return response.data;
  } catch (error: any) {
   await handleErrorResponse(error);
  }
}

// **공통 에러 처리**
async function handleErrorResponse(error: any): Promise<void> {
  if (error.response?.status === 401) {
    console.error('권한없는 요청입니다. 로그인화면으로 리다이렉팅합니다.');
    await handleUnauthorizedRequest();
  } else {
    console.error('API Error:', error.message || error);
  }
  throw error;
}

// 로그인화면으로 리다이렉트
export async function handleUnauthorizedRequest() {
  const router = useIonRouter(); // 함수 내부에서 호출
  router.replace('/loginName');
}
