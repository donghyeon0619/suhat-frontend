// 로그인 api 함수
import {post} from "@/api/httpService";
import {setToken, setUserInfo} from "@/store/secureStorage";

export async function signup(userInfo : { name: string; gender:string; school: string;}){
  const response = await post('users/signup', userInfo);

  if (response.token){
    // 유저 정보와 토큰을 별도로 저장
    await setUserInfo(userInfo);
    await setToken(response.token);
  }

  return response
}