# 테스트 서버와 Android 주소 설정

## 연결 구조

센터의 Spring Boot 프로세스 하나가 모든 게임방과 SSE 연결을 관리한다. 테스트도 같은 구조를 사용한다. HTTPS 임시 도메인은 이 프로세스 앞의 프록시 또는 터널에 연결한다. 프록시는 별도의 게임 서버가 아니다.

테스트 서버에는 독립된 MySQL 데이터베이스와 테스트 계정이 필요하다. 서버가 실행되지 않은 상태에서는 임시 도메인만 발급해도 게임을 테스트할 수 없다.

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

테스트 서버와 연결 가능한 Android 기기가 준비되지 않아 실제 임시 도메인 발급·접속과 기기 게임 테스트는 수행하지 않았다. 주소 구성 검증과 빌드 검증은 실제 네트워크 검증과 구분한다. 기기가 준비되면 [모바일 검증 순서](mobile-validation.md)를 수행한다.
