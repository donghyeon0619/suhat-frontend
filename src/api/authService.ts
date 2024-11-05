// 로그인 api 함수
import {post} from "@/api/httpService";
import {setUserInfo} from "@/store/secureStorage";
import {setSessionId} from "@/store/secureStorage";

export async function signup(userInfo : { name: string; gender:number; school: string;}){
  const response = await post('users/signup', userInfo);

  if (response){
    // 유저 정보와 토큰을 별도로 저장
    await setUserInfo(userInfo);
    await setSessionId(response);
  }

  console.log(response, "111");

  return response
}