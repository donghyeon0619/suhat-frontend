# 테스트 서버와 Android 주소 설정

## 연결 구조

센터의 Spring Boot 프로세스 하나가 모든 게임방과 SSE 연결을 관리한다. 테스트도 같은 구조를 사용한다. HTTPS 임시 도메인은 이 프로세스 앞의 프록시 또는 터널에 연결한다. 프록시는 별도의 게임 서버가 아니다.

전체 서비스 검증에는 독립된 MySQL 데이터베이스와 테스트 계정이 필요하다. 게임 연결 검증은 백엔드의 `mobileSmokeServer` 작업으로 H2 메모리 DB를 사용하는 실제 서버를 실행할 수 있다. 운영 설정과 데이터는 읽지 않는다.

## HTTPS 주소 준비

SSE 스트리밍과 세션 쿠키를 지원하는 HTTPS 프록시 또는 터널을 사용한다. Cloudflare Quick Tunnel은 [SSE를 지원하지 않는다](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/). HTTPS 인증서 검증을 끄거나 앱 전체에 HTTP를 허용하지 않는다.

프록시의 `/api/` 경로는 Spring Boot로 전달하고 응답 버퍼링을 끈다. 유휴 제한은 heartbeat 간격인 30초보다 길게 설정한다. HTTPS를 프록시에서 종료한다면 외부 접근을 프록시로 제한하고 `X-Forwarded-Proto: https`를 전달한다.

서버 설정은 테스트 환경에 맞춰 지정한다.

| 설정 | 값 |
|---|---|
| `frontend.url` | 발급받은 HTTPS origin |
| `server.servlet.session.cookie.domain` | 발급받은 호스트명, 스킴·경로 제외 |
| `server.servlet.session.cookie.secure` | `true` |
| `server.servlet.session.cookie.same-site` | `none` |
| `server.forward-headers-strategy` | 신뢰할 수 있는 프록시 뒤에서 `framework` |
| DB 연결·계정 | 별도 테스트 DB |

쿠키 설정은 Servlet 세션과 Spring Session serializer에 같은 도메인을 적용한다. 프록시가 TLS를 종료할 때만 백엔드의 SSL을 끄고, 해당 HTTP 포트는 공개하지 않는다. 기존 운영 설정을 그대로 실행하지 않는다.

## Android 테스트 빌드 준비

아래 주소는 예시이며 실제 발급된 주소로 바꿔야 한다.

```powershell
$env:SUHAT_TEST_API_URL = 'https://발급받은-호스트'
npm run android:test:prepare
```

명령은 웹 API 주소와 Android WebView 호스트를 같은 origin으로 맞추고 웹 빌드와 `cap sync android`를 실행한다. APK 빌드는 Android SDK가 있는 환경에서 별도로 수행한다.

```powershell
cd android
./gradlew.bat assembleDebug
```

임시 호스트는 기존 앱과 저장소 origin이 다르므로 테스트 계정으로 로그인한다. 임시 도메인이 바뀌면 다시 빌드한다. 앱의 서버 URL을 원격 웹페이지로 바꾸지 않으며 화면은 APK에 포함된 asset을 사용한다.

기본 호스트로 되돌릴 때는 테스트 환경 변수를 제거하고 다시 빌드·동기화한다.

```powershell
Remove-Item Env:SUHAT_TEST_API_URL -ErrorAction SilentlyContinue
Remove-Item Env:VITE_API_URL -ErrorAction SilentlyContinue
npm run build
npx cap sync android
```

## 검증 상태

Pinggy 임시 HTTPS 터널과 Android 14 에뮬레이터로 APK 설치·실행, 세션과 SSE 통신을 확인했다. 실제 휴대폰 검증과 구분한다. 상세 범위는 [모바일 검증](mobile-validation.md)을 따른다.

Pinggy 무료 터널의 브라우저 안내 화면이 API 응답을 가리는 경우 테스트 빌드에만 `SUHAT_TEST_USER_AGENT=SuhatMobileTest/1.0`을 지정한다. 이는 제공자가 문서화한 API 클라이언트 설정이다. 기본 빌드의 User-Agent는 변경하지 않는다. 검증 후 `SUHAT_TEST_API_URL`, `SUHAT_TEST_USER_AGENT`, `VITE_API_URL`을 제거하고 기본 빌드를 다시 동기화한다.
