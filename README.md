# 수햇 앱

Vue 3, Ionic, Capacitor 6으로 구현한 스마트폰 중독 예방 보드게임 앱이다. 이 저장소에는 Android 프로젝트가 포함되어 있다.

## 개발

```sh
npm ci
npm run dev
```

API 기본 주소는 `https://suhat.kr`이다. 테스트 서버를 사용할 때는 `VITE_API_URL`을 설정하고 서버 인증·쿠키·HTTPS 설정도 함께 맞춘다. 운영 서버에서 개발 데이터를 만들지 않도록 테스트 환경을 먼저 준비한다.

## 검증과 Android 동기화

```sh
npm run build
npm run test:unit -- --run tests/unit/gameRevision.spec.ts tests/unit/eventSourceStore.spec.ts tests/unit/gameLifecycle.spec.ts
npx cap sync android
npx cap open android
```

APK 빌드는 Android SDK와 JDK가 필요하다. `cap sync`는 APK 빌드나 기기 동작 검증을 대신하지 않는다.

- [게임 상태 복구](docs/game-reconnection.md)
- [모바일 검증 범위와 기기 시나리오](docs/mobile-validation.md)
- [개발 규칙](CONTRIBUTING.md)
