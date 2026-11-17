# 게임 화면 복구

게임 화면은 `game-state` SSE 전체 상태를 기준으로 표시한다. 이벤트 ID와 본문의 revision이 일치하고 마지막 적용 번호보다 클 때만 반영한다. 연결을 다시 만들면 새 전체 상태를 받아 현재 단계로 이동한다. 과거 이벤트의 연출은 재생하지 않는다.

`eventSourceStore`는 연결, 재시도, heartbeat, 핸들러 수명을 관리한다. `MultiGamePlayView`는 전체 상태와 화면 이동을 연결한다. `useSpeakingState`는 서버 마감 시각으로 남은 시간을 계산하고 카드 표시를 복구한다.

앱을 백그라운드로 보내면 전송 연결만 닫는다. 복귀하면 다시 연결한다. 사용자가 나가기를 확인한 경우에만 방 나가기 API를 호출한다. 네트워크 오류는 최대 30초 간격으로 재시도하고, 인증·참가 권한이 없거나 유예가 만료됐다는 응답을 받으면 중단한다.

투표 미제출은 서버의 마감에 따라 기권 처리된다. 점수와 다음 발언자를 클라이언트에서 증가시키지 않는다. 최근 투표의 동의·비동의·기권 수는 상태에 포함되어 복귀한 사용자도 확인할 수 있다.

## 확인 명령

```sh
npm ci
npm run build
npm run test:unit -- --run tests/unit/gameRevision.spec.ts tests/unit/eventSourceStore.spec.ts tests/unit/gameLifecycle.spec.ts
```

실제 기기에서는 백그라운드 복귀, Wi-Fi/모바일 데이터 전환, 발언 중 연결 끊김, 투표 후 재접속, 3분 경과 후 복귀를 추가 확인한다. 서버도 함께 업데이트해야 한다.

모바일 설정과 미검증 범위는 [모바일 검증](mobile-validation.md)에 정리했다.
