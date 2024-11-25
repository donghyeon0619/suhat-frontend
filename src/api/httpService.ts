  import {CapacitorHttp, HttpOptions} from '@capacitor/core';
  import {getSessionId} from "@/store/secureStorage";


  const BASE_URL = 'http://localhost:8080/api/';

  // 세션 정보 받아오기
  async function getSessionHeaders(): Promise<{[key:string]:string}>{
    const sessionId = await getSessionId();
    return sessionId ? { 'X-session-ID': sessionId }: {};

  }

  // Post Request
  export async function post(endpoint: string, data: any, token?: string):Promise<any>{

    const sessionHeaders = await getSessionHeaders();

    const options: HttpOptions = {
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...sessionHeaders,
      },
      data,
    };

    const response = await CapacitorHttp.post(options);
    return response.data;
  }

  // Get Request
  export async function get(endpoint: string, params: any, token?: string): Promise<any> {

    const sessionHeaders = await getSessionHeaders();
    console.log(sessionHeaders); // 세션 헤더 확인

    const options: HttpOptions = {
      url: `${BASE_URL}${endpoint}`,
      headers: {
        ...sessionHeaders,
      },
      params,
    };

    try {
      const response = await CapacitorHttp.get(options);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        // 세션 만료 시 로그인 페이지로 이동
      }
      throw error;
    }
  }