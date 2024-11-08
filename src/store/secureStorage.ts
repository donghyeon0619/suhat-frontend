import {SecureStorage, StorageError, StorageErrorType} from "@aparajita/capacitor-secure-storage";


// 지정된 키와 값을 사용하여 데이터를 안전하게 저장하는 함수
export async function setSecureItem(key: string, value: any) {
  try{
    await SecureStorage.set(
      key,
      JSON.stringify(value), // 데이터를 JSON 문자열로 반환하여 저장
      true, // Optional: defaults to true
    )
  } catch (error) {
    handleStorageError(error);
  }
}

// 토큰 저장함수
export async function setSessionId(sessionId: string) {
  try {
    await SecureStorage.set('sessionId', sessionId);
  } catch (error){
    handleStorageError(error);
  }
}

// 토큰 가져오기 함수
export async function getSessionId(){
  try {
    return await SecureStorage.get('sessionId') as string | null;
  } catch (error) {
    handleStorageError(error);
  }
}

// 토큰 삭제 함수
export async function removeSessionId() {
  try {
    await SecureStorage.remove('sessionId');
  } catch (error) {
    console.error('Error removing sessionId:', error);
  }
}

// 지정된 키를 사용하여 저장된 데이터를 가져오는 함수
export async function getSecureItem<T>(key: string) {
  try {
    const value = await SecureStorage.get(key);

    // value가 문자열일 경우
    if (typeof value === 'string') {
      return JSON.parse(value) as T;
    } else {
      // string이 아닐 경우
      return value as T;
    }
  } catch (error) {
    handleStorageError(error);
    return null;
  }
}



// 지정된 키를 사용하여 저장된 데이터를 제거하는 함수
export async function removeSecureItem(key: string): Promise<void>{
  try {
    await SecureStorage.remove(key);
  } catch (error) {
    handleStorageError(error);
  }
}


// 지정된 모든 데이터를 삭제하는 함수
export async function clearSecureStorage(): Promise<void>{
  try{
    await SecureStorage.clear();
  } catch (error) {
    handleStorageError(error);
  }
}


// 저장소 작업 중 발생하는 에러를 처리하는 함수
function handleStorageError(error: unknown) {
  if (error instanceof StorageError) {
    switch (error.code) {
      case StorageErrorType.missingKey:
        console.log('에러: 키가 없거나 비어있습니다.')
        break;
      case StorageErrorType.invalidData:
        console.error('에러: 저장된 데이터가 손상되었습니다.');
        break;
      case StorageErrorType.osError:
        console.error('에러: 시스템 레벨에서 오류가 발생했습니다.');
        break;

      default:
        console.error('알 수 없는 저장소 오류:', error.message);
    }
  } else {
    console.error('일반 오류', error);
  }
}