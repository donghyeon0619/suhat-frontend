import {CapacitorHttp, HttpOptions } from '@capacitor/core';
import {useIonRouter, alertController} from "@ionic/vue";

const BASE_URL = 'http://localhost:8070/api/';

// **HTTP 요청 함수**
/**
 * 공통 HTTP 옵션 생성
 * @param endpoint - API 엔드포인트
 * @param method - HTTP 메서드 ('GET' | 'POST')
 * @param data - 요청 본문 데이터 (POST 등에서 사용)
 * @param params - 요청 URL 파라미터 (GET 등에서 사용)
 * @returns HttpOptions
 */
export async function getHttpOptions(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  data?: any,
  params?: any
): Promise<HttpOptions> {
  return {
    url: `${BASE_URL}${endpoint}`,
    headers: {
      'Content-Type': 'application/json',
    },
    params: params || undefined,
    data: method !== 'DELETE' ? data || undefined : undefined,
    method,
  };
}

/**
 * GET 요청
 */
export async function get(
  endpoint: string,
  params?: any,
  returnFullResponse: boolean = false // 옵션 추가: 전체 응답 반환 여부
): Promise<any> {
  const options = await getHttpOptions(endpoint, 'GET', undefined, params);

  // 쿠키 전송 활성화
  options.webFetchExtra = {
    credentials: 'include', // 쿠키 포함 설정
  };

  try {
    const response = await CapacitorHttp.get(options);


    await validateHttpResponse(response);

    // 전체 response 반환 여부에 따라 처리
    return returnFullResponse ? response : response.data;
  } catch (error: any) {
    console.log("에러가 발생했습니다.", error)
    throw error;
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

    await validateHttpResponse(response)

    return response.data;
  } catch (error: any) {
    console.log("에러가 발생했습니다.", error)
    throw error;
  }
}

export async function put(endpoint: string, data: any): Promise<any> {
  const options = await getHttpOptions(endpoint, 'PUT', data);

  // 쿠키 전송 활성화
  options.webFetchExtra = {
    credentials: 'include', // 쿠키 포함 설정
  };

  try {
    const response = await CapacitorHttp.put(options);

    await validateHttpResponse(response)

    return response.data;
  } catch (error: any) {
    console.log("에러가 발생했습니다.", error)
    throw error;
  }
}

export async function deleteRequest(endpoint: string, returnFullResponse: boolean = false // 옵션 추가: 전체 응답 반환 여부
): Promise<any> {
  const options = await getHttpOptions(endpoint, 'DELETE');

  // 쿠키 전송 활성화
  options.webFetchExtra = {
    credentials: 'include', // 쿠키 포함 설정
  };

  try {
    const response = await CapacitorHttp.delete(options);

    await validateHttpResponse(response)

    return returnFullResponse ? response : response.data;
  } catch (error: any) {
    console.log("에러가 발생했습니다.", error)
    throw error;
  }
}

/**
 * HTTP 응답 검증 및 상태 코드 처리
 * @param response - HTTP 응답 객체
 */
export async function validateHttpResponse(response: any): Promise<void> {
  const status = response.status;

  if (status === 401) {
    console.warn("401 Unauthorized - 권한이 없습니다.");
    await handleUnauthorizedRequest();
    return;
  }

  if (status === 403) {
    console.warn("403 Forbidden - 접근 권한이 없습니다.");
    throw new Error("403 Forbidden - 접근 권한이 없습니다.");
  }

  if (status >= 500) {
    console.error(`500 Internal Server Error - 서버에서 문제가 발생했습니다.`);
    throw new Error(`500 Server Error: ${response.data}`);
  }

  if (status >= 400) {
    console.error(`400 Bad Request - 요청 오류가 발생했습니다.`);
    throw new Error(`400 Bad Request: ${response.data}`);
  }

  console.log(`HTTP 상태 코드 ${status} - 응답이 유효합니다.`);
}


/**
 * 세션이 만료 및 없을 시 로그인으로 리다이렉션
 */
export async function handleUnauthorizedRequest() {
  console.log("로그인으로 리다이렉션")
  const router = useIonRouter(); // 함수 내부에서 호출
  router.replace('/loginName');
}
