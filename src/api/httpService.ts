import {CapacitorHttp, HttpOptions} from '@capacitor/core';

const BASE_URL = 'http://localhost:8080/api/';

// Post Request
export async function post(endpoint: string, data: any, token?: string):Promise<any>{

  const options: HttpOptions = {
    url: `${BASE_URL}${endpoint}`,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}`} : {}),
    },
    data,
  };

  const response = await CapacitorHttp.post(options);
  return response.data;
}

// Get Request
export async function get(endpoint: string, params: any, token?: string): Promise<any> {

  const options: HttpOptions = {
    url: `${BASE_URL}${endpoint}`,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}`} : {}),
    },
    params,
  };

  const response = await CapacitorHttp.get(options);
  return response.data;
}