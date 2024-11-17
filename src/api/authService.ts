// 로그인 api 함수
import {post} from "@/api/httpService";
import {setSessionId} from "@/store/secureStorage";
import store from "@/store";

export async function signup(){
  const userInfo = store.getters["user/userInfo"];
  const response = await post('users/signup', userInfo);

  if (response){
    await setSessionId(response);
  }

  console.log(response, "111");

  return response
}