import {CapacitorCookies, CapacitorHttp} from "@capacitor/core";
import {get, getHttpOptions} from "@/api/httpService";

import { API_URL as BASE_URL } from '@/config/api';

/**
 * 쿠키 및 세션 관리 모듈
 */

/**
 * JSESSIONID 설정하기
 */
export async function setJSessionId(jsessionId: string) {
  if (!jsessionId) {
    console.error('유효하지 않은 session 값:', jsessionId);
    return;
  }

  try {
    await CapacitorCookies.setCookie({
      url: BASE_URL, // 백엔드 URL
      key: 'JSESSIONID',
      value: jsessionId,
      path: '/', // Spring Security 기본 경로
    });
  } catch (error) {
    console.error('JSESSIONID 설정 실패:', error);
  }
}

/**
 * JSESSIONID 가져오기
 */
export async function getJSessionId(): Promise<string | null> {
  const result = await CapacitorCookies.getCookies({url: BASE_URL});
  // 쿠키 데이터가 최상위 수준에 있을 경우 처리
  const jSessionId = result['JSESSIONID'] || null;

  return jSessionId;
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

/**
 * 세션 유효성 확인 API 호출
 * @returns {Promise<boolean>} 세션 유효 여부
 */
export async function validateSession(): Promise<boolean> {

  const options = await getHttpOptions('users/session', 'GET', undefined, undefined);

  // 쿠키 전송 활성화
  options.webFetchExtra = {
    credentials: 'include', // 쿠키 포함 설정
    mode: 'cors'
  };

  try {
    // API 호출
    const response = await CapacitorHttp.get(options);

    // 응답 상태 확인
    if (response.status === 200) {
      console.log('세션 유효성 확인: 유효한 세션입니다.');
      return true;
    } else {
      console.warn('세션 유효성 확인: 유효하지 않은 세션입니다.');
      return false;
    }
  } catch (error) {
    console.error('세션 유효성 확인 중 오류 발생:', error);
    return false;
  }
}
