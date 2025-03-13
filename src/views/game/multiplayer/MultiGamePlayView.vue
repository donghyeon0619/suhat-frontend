<script setup lang="ts">
import {
  alertController,
  IonPage, modalController,
  onIonViewWillEnter,
  onIonViewWillLeave,
  toastController,
  useIonRouter
} from "@ionic/vue";
import GameRound0neView from "@/views/game/multiplayer/GameRound0neView.vue";
import {computed, provide, reactive, ref} from "vue";
import SpeakerView from "@/views/game/multiplayer/speaker/SpeakerView.vue";
import ListenerView from "@/views/game/multiplayer/listener/ListenerView.vue";
import {onBeforeRouteLeave, useRoute} from "vue-router";
import {deleteRequest, get} from "@/api/httpService";
import {useEventSourceStore} from "@/store/eventSourceStore";
import {GamePhase, GameState} from "@/types/GameState";
import {useUserStore} from "@/store/user";
import GameExitHeader from "@/components/game/GameExitHeader.vue";
import {AssignedCard} from "@/types/Card";
import {VoteResult} from "@/types/VoteResult";
import {RoomStatus, useGameStore} from "@/store/gameStore";
import {showAlert} from "@/utils/showAlert";
import {gameHooks} from "@/globals/gameHooks";

// 라우트 파라미터
const route = useRoute();
const roomId = String(route.params.roomId);
const router = useIonRouter();

// store 변수 선언
const eventSourceStore = useEventSourceStore();
const userStore = useUserStore();
const gameStore = useGameStore();
const roomStatus = computed(() => gameStore.roomStatus);

// 상태 플래그
const orderAssigned = ref(false);
const isHost = ref(false); // 호스트인지 여부
const isSpeaker = ref(true); // 발언자인지 여부 (서버에서 결정되거나 초기화)
const assignedCard = ref<AssignedCard | null>(null);
const timerStartData = ref<{ startTime: number } | null>(null);
const timeExtensionData = ref<{ additionalTime : number } | null>(null);
let timeoutId: ReturnType<typeof  setTimeout> | null = null;
const isLeaving = ref(false);

// speaker 객체
const speaker = computed(() => {
  return gameState.players.find((player) => player.isSpeaking) || null;
})

// 시간 동기화 관련 함수
const timeDifference = ref(0);
const syncInterval = ref<NodeJS.Timeout | null>(null);

/**
 * 게임 상태 변수
 */
const gameState = reactive<GameState>({
  roomId: roomId || '',
  roomName: '',
  hostId: 0,
  totalPlayers: 0,
  totalPuzzlePieces: 0,
  currentPuzzlePieces: 0,
  currentTurn: 0,
  currentRound: 1,
  assignedPictureCardId: 0,
  assignedTextCardId: 0,
  currentPhase: GamePhase.NONE,
  players: [],
})

// 투표 결과 저장
const voteResult = ref<VoteResult | null>(null);


/**
 * provide 함수
 */
provide("assignedCard", assignedCard);
provide("timerStartData", timerStartData);
provide("timeExtensionData", timeExtensionData);
provide("voteResult", voteResult);

/**
 * 클라이언트-서버 시간 차이 계산 함수
 */
const calculateTimeDifference = async (): Promise<number> => {
  try {
    const requestTime = Date.now();
    const response = await get(`games/${roomId}/time-sync`)
    const responseTime = Date.now();

    const serverTime = response.serverTime; // 서버 시간(밀리초 단위)
    const rtt = responseTime - requestTime; // 왕복 지연 시간
    const estimatedServerTime = serverTime + rtt / 2; // RTT를 반으로 나누어 서버 시간 추정

    return estimatedServerTime - responseTime; // 클라이언트 시간과 서버 시간의 차이
  } catch (error) {
    console.error("서버 시간 가져오기 실패:', error");
    return 0;
  }
}

/**
 * 'game-ended' 이벤트: 플레이어  떠남으로 인한 게임종료
 * @param event
 */
const gameEndedHandler = (event:MessageEvent) =>{
  console.log('game-ended 이벤트 수신:', event.data);

  gameStore.roomStatus = RoomStatus.ENDED;
  const toastMessage = "게임이 종료되어 홈으로 이동합니다.";
  // 메시지를 Toast에 표시
  presentToast(toastMessage);

  setTimeout(() => {
    router.replace({
      path: '/game/home'
    });
  }, 2000);
}

/**
 * 'not-in-room' 게임 다시 입장 시 방에 없어서 홈으로 이동
 * @param event
 */
const notInRoomHandler = (event:MessageEvent) =>{
  console.log('not-in-room 이벤트 수신:', event.data);

  isLeaving.value = true;
  gameStore.roomStatus = RoomStatus.CLOSED;
  eventSourceStore.disconnectByUser();

  // 메시지를 Toast에 표시
  presentToast(event.data);

  setTimeout(() => {
    router.replace({
      path: '/game/home'
    });
  }, 1500);
}

/**
 * 'game-rest' 이벤트: 게임 초기화 완료 후 대기방 이동
 * @param event
 */
const gameResetHandler = (event: MessageEvent) => {
  console.log('game-reset 이벤트 수신:', event.data)

  // 이벤트 데이터 파싱
  const eventData = JSON.parse(event.data);
  // 메시지 생성
  const reason = eventData.reason || "알 수 없는 이유";
  const dataMessage = eventData.data || "알 수 없는 데이터";
  const toastMessage = `${dataMessage}\n(사유: ${reason})`;

  gameStore.roomStatus = RoomStatus.ENDED;

  presentToast(toastMessage)

  setTimeout(() => {
    router.replace({
      path: `/game/waiting/${roomId}`
    });
  }, 3000);

}

/**
 * 플레이어 순번 부여 이벤트 핸들러 함수
 * @param event
 */
const playerOrderAssignedHandler = (event: MessageEvent) => {
  const playerOrder: { [key: string]: number; } = JSON.parse(event.data);
  console.log('player-order-assigned 이벤트 수신:', playerOrder);

  gameState.players = gameState.players.map(player => ({
    ...player,
    sequenceNumber: playerOrder[player.playerId],
  }));
  // 모든 플레이어의 순번이 정해졌음
  console.log('모든 플레이어의 순번이 정해졌습니다.', gameState.players);

  orderAssigned.value = true;
}

/**
 * 라운드 2 시작 이벤트 핸들러 함수
 * @param event
 */
const roundTwoStartedHandler = (event: MessageEvent) => {
  const eventData = JSON.parse(event.data);

  gameState.currentRound = eventData.round;
  gameState.currentTurn = 1;

  isSpeaker.value = userStore.id === eventData.speakerId;

  const currentSpeaker = gameState.players.find(
    (player) => player.playerId === eventData.speakerId
  );

  if(currentSpeaker) {
    currentSpeaker.isSpeaking = true;
  } else {
    console.error(`${eventData.speakerId} 의 플레이어가 존재하지 않습니다.`);
  }

  gameState.currentPhase = eventData.currentPhase;
};

/**
 * 카드 할당 이벤트 함수 (provide, inject)로 데이터 전달
 * @param event
 */
const cardAssignedHandler = (event: MessageEvent) => {
  const eventData = JSON.parse(event.data);
  console.log("카드 할당 이벤트 수신:", eventData);
  assignedCard.value = {
    cardType: eventData.cardType,
    cardId: eventData.cardId,
  };
  if (eventData.cardType === "picture") {
    gameState.assignedPictureCardId = eventData.cardId
  } else {
    gameState.assignedTextCardId = eventData.cardId
  }
}

/**
 * 타이머 시작 이벤트 핸들러 함수
 * @param event
 */
const timerStartHandler = (event: MessageEvent) => {
  const eventData = JSON.parse(event.data)
  console.log('타이머 시작하세요', eventData);
  timerStartData.value = {
    startTime: eventData.startTime + timeDifference.value,
  }
}

/**
 * 타이머 연장 이벤트 핸들러 함수
 * @param event
 */
const timeExtendedHandler = (event: MessageEvent) => {
  const eventData = JSON.parse(event.data);
  console.log('시간 연장되었어요.', eventData);
  timeExtensionData.value = {
    additionalTime: eventData.additionalTime
  };
};

/**
 * 말하기 종료 핸들러 함수
 * @param event
 */
const speakingEndHandler = (event: MessageEvent) => {
  const eventData = event.data;
  console.log('말하기가 종료 되었습니다.', eventData);
  presentToast(eventData, true);
  gameState.currentPhase = GamePhase.VOTING;
}

/**
 * 투표 결과 이벤트 핸들러 함수
 */
const voteResultHandler = (event: MessageEvent) => {
  const eventData = JSON.parse(event.data);
  console.log("투표 결과 이벤트를 받았습니다");

  switch (eventData.result) {
    // 퍼즐 획득 후 다음 턴으로 이동해야 할때
    case "puzzle-acquired-next-turn":
      // 1.5초 이후 퍼즐 갯수 증가
      timeoutId = setTimeout(() => {
        incrementPuzzlePieces();
      }, 1500);
      voteResult.value = {
        ...voteResult.value,
        type: "puzzle-acquired",
        agreeCount: eventData.agreeCount,
        disagreeCount: eventData.disagreeCount,
        hasReVoted: eventData.hasReVoted,
        nextSpeakerId: eventData.nextSpeakerId,
      };
      break;

    // 재투표일 때
    case "re-vote":
      voteResult.value = {
        ...voteResult.value,
        type: "re-vote",
        agreeCount: eventData.agreeCount,
        disagreeCount: eventData.disagreeCount,
        disagreePlayers: eventData.disagreePlayers,
      };
      break;

    // 퍼즐 실패 후 다음턴으로 이동해야할 때
    case "puzzle-failed-next-turn":
      voteResult.value = {
        ...voteResult.value,
        type: "puzzle-failed",
        agreeCount: eventData.agreeCount,
        disagreeCount: eventData.disagreeCount,
        nextSpeakerId: eventData.nextSpeakerId
      };
      break;

    // 퍼즐을 전부 모아 게임 끝났을 때
    case "game-completed":
      // 1.5초 이후 퍼즐 갯수 증가
      timeoutId = setTimeout(() => {
        incrementPuzzlePieces();
      }, 1500);
      voteResult.value = {
        ...voteResult.value,
        type: "game-completed",
        agreeCount: eventData.agreeCount,
        disagreeCount: eventData.disagreeCount,
        rankingData: eventData.rankingData,
        hasReVoted: eventData.hasReVoted
      };
      break;

    // 다른 결과 타입이 있을 때
    default:
      console.log("알수 없는 결과 타입", eventData.result);
  }
}


/**
 * 앱이 pause 되었을 떄, 핸들러
 */
const onPauseHandler = async () => {
  console.log("앱이 퍼즈상태로 갈때 게임 종료 요청");
  // 앱이 퍼즈상태가 되면 게임 종료 요청을 보내게 함
  eventSourceStore.disconnectByUser();
  try {
    await deleteRequest(`rooms/${roomId}/players`, true);
  } catch (error: any) {
    // 서버 응답에서 오류 메시지를 가져와 경고창 표시
    const errorMessage = error?.message || "알 수 없는 오류가 발생했습니다.";
    console.error('방 나가기 중:', errorMessage);

  }
}

/**
 * 앱에 다시 접속했을 때 방에 나가졌으므로 홈으로 이동
 */
const onResumeHandler = async () => {
  gameStore.roomStatus = RoomStatus.CLOSED;
  await showAlert(
    "연결 끊김",
    "게임 도중 네트워크 문제로 연결이 끊어져 방에서 나가게 되었습니다. 홈으로 이동합니다.", [
      {
        text: "확인", role: "confirm", handler: () => {
          router.back();
        }
      }]
  );
}

/**
 * 퍼즐 갯수 증가 함수
 */
const incrementPuzzlePieces = () => {
  // 현재 퍼즐 조각 개수 증가
  ++gameState.currentPuzzlePieces;

  // speaker의 collectedPuzzlePiececs 증가
  if (speaker.value) {
    ++speaker.value.collectedPuzzlePieces;
  }
}

/**
 * 주기적인 시간 동기화 함수
 */
const periodicTimeSync = async () => {
  timeDifference.value = await calculateTimeDifference();
  console.log(`주기적인 시간 동기화 완료, 시간 차이: ${timeDifference.value}ms`);
}

/**
 * 다음 턴으로 이동 하는 함수
 * @param nextSpeakerId
 */
const handleNextTurn = (nextSpeakerId: number) => {
  console.log(`다음 순번으로 넘어가면서 ${nextSpeakerId}로 말하기 변경`);

  // 1. 현재 speaker의 isSpeaking을 false로 설정
  if(speaker.value) {
    speaker.value.isSpeaking = false
  }

  // 3. 현재 사용자가 speaker인지 확인
  isSpeaker.value = userStore.userInfo.id === nextSpeakerId;

  // 2. nextSpeakerId에 해당하는 player의 isSpeaking을 true로 설정
  const nextSpeaker = gameState.players.find(
    (player) => player.playerId === nextSpeakerId
  );
  if (nextSpeaker) {
    nextSpeaker.isSpeaking = true;
    gameState.currentTurn = nextSpeaker.sequenceNumber;
  } else {
    console.error(`${nextSpeakerId}의 플레이어가 존재하지 않습니다`);
  }

  // 4. currentPhase를 speaker인지 여부에 따라 설정
  gameState.currentPhase = GamePhase.DISCUSSION;

  console.log("발화자가 바꼈습니다. 다음 순번으로 넘어갑니다.");

}

/**
 * 화면이 처음에 랜더링 되었을떄,
 */
onIonViewWillEnter(async () => {

  console.log("게임 시작되어 게임상태를 불러옵니다.")
  try {

    const response = await get(`games/${roomId}/state`);
    Object.assign(gameState, response); // 서버에서 가져온 데이터를 gamestate에 병합

    //호스트 여부 확인
    const currentUserId = userStore.userInfo.id; // pinia에서 userId 가져오기
    if (gameState.hostId === currentUserId) {
      isHost.value = true;
    }

    console.log("초기 게임 상태:", gameState);
  } catch (error) {
    console.error("게임 상태를 불러오는 중 오류 발생 ")
  }

  // 초기 시간 동기화
  timeDifference.value = await calculateTimeDifference();

  await addEventListeners();

  // 주기적인 시간 동기화 설정(매 10마다)
  syncInterval.value = setInterval(periodicTimeSync, 600000);
});

/**
 * 게임 상태를 초기화 하는 함수
 */
const resetGameState = () => {
  orderAssigned.value = false;
  isHost.value = false;
  isSpeaker.value = false;
  assignedCard.value = null;
  timerStartData.value = null;
  timeExtensionData.value = null;
  voteResult.value = null;
  isLeaving.value = false;
  if(syncInterval.value) {
    clearInterval(syncInterval.value);
  }
}

/**
 * 페이지를 떠날 때 리스너 제거
 */
onIonViewWillLeave(async () => {
  console.log('Leaving MultiGameView, cleaning up listeners');

  let topModal = await modalController.getTop(); // 최상위 모달 가져오기

  while (topModal) {
    await modalController.dismiss(); // 현재 모달 닫기
    topModal = await modalController.getTop(); // 다음 최상위 모달 확인
  }

  removeEventListeners();

  if(timeoutId) {
    clearTimeout(timeoutId);
  }

  resetGameState();

})

/**
 * 이벤트 리스너들 등록
 */
const addEventListeners = async () => {
  eventSourceStore.addEventListener("game-ended", gameEndedHandler);
  eventSourceStore.addEventListener("not-in-room", notInRoomHandler)
  eventSourceStore.addEventListener("player-order-assigned", playerOrderAssignedHandler);
  eventSourceStore.addEventListener("round-2-started", roundTwoStartedHandler);
  eventSourceStore.addEventListener("game-reset", gameResetHandler);
  eventSourceStore.addEventListener("card-assigned", cardAssignedHandler);
  eventSourceStore.addEventListener("timer-start", timerStartHandler);
  eventSourceStore.addEventListener("time-extended", timeExtendedHandler);
  eventSourceStore.addEventListener("speaking-end", speakingEndHandler);
  eventSourceStore.addEventListener("vote-result", voteResultHandler);

  // // 앱이 백그라운드 갈때의 이벤트 리스너
  // pauseHandle = await App.addListener('pause', onPauseHandler);
  //
  // // 앱이 포그라운드로 돌아올 때
  // resumeHandle = await App.addListener('resume', onResumeHandler);
  gameHooks.onPauseHandler = onPauseHandler;
  gameHooks.onResumeHandler = onResumeHandler;

}

/**
 * 이벤트 리스너들 제거
 */
const removeEventListeners = async () => {
  eventSourceStore.removeEventListener('game-ended', gameEndedHandler);
  eventSourceStore.removeEventListener('player-order-assigned', playerOrderAssignedHandler);
  eventSourceStore.removeEventListener('round-2-started', roundTwoStartedHandler);
  eventSourceStore.removeEventListener('game-reset', gameResetHandler);
  eventSourceStore.removeEventListener("card-assigned", cardAssignedHandler);
  eventSourceStore.removeEventListener("timer-start", timerStartHandler);
  eventSourceStore.removeEventListener("time-extended", timeExtendedHandler);
  eventSourceStore.removeEventListener("speaking-end", speakingEndHandler);
  eventSourceStore.removeEventListener("vote-result", voteResultHandler);
  eventSourceStore.removeEventListener("not-in-room", notInRoomHandler);

  gameHooks.onPauseHandler = undefined;
  gameHooks.onResumeHandler = undefined;

  // if (pauseHandle) {
  //   await pauseHandle.remove();
  //   pauseHandle = undefined;
  // }
  //
  // if (resumeHandle) {
  //   await resumeHandle.remove();
  //   resumeHandle = undefined;
  // }
}

/**
 * 방 나가기 요청을 서버에 전송
 */
const leaveRoom = async () => {
  if (isLeaving.value) {
    return;
  }
  isLeaving.value = true;
  eventSourceStore.disconnectByUser();

  try{
    const response = await deleteRequest(`rooms/${roomId}/players`, true);

    if(response.status == "200") {
      console.log('게임방 나가기 요청 성공');
      gameStore.roomStatus = RoomStatus.CLOSED;
    } else {
      console.error('게임 나가기 요청 실패', response);
      gameStore.roomStatus = RoomStatus.CLOSED;
      return;
    }
  } catch (error) {
    console.error('게임방 나가기 요청 중 에러 발생: ', error);
    gameStore.roomStatus = RoomStatus.CLOSED;
    return;
  }
};

// 방나가기 함수
const gameExit = async () => {
  router.back();
}

/**
 * 라우팅전 네비게이션 가드 함수
 */
onBeforeRouteLeave(async (to, from, next) => {

  // 게임 나가기 중일 때 바로 진행
  if (isLeaving.value) {
    next();
    return;
  }

  // 게임이 종료되었거나 방이 사라졌을 때,
  if (roomStatus.value === RoomStatus.ENDED || roomStatus.value === RoomStatus.CLOSED) {
    next();
    return;
  }

  const confirmed = await presentAlert();
  if (confirmed) {
    try {
      await leaveRoom();
      next();
    } catch (error) {
      next();
    }
  } else {
    next(false);
  }
});

/**
 * 방 나갈때 경고창 보여줌
 */
const presentAlert = async (): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    alertController.create({
      header: '방 나가기',
      message: '정말로 방에서 나가시겠습니까?',
      buttons: [
        {
          text: '확인',
          role: 'confirm',
          cssClass: "my-custom-alert-button-class",
          handler: () => resolve(true),
        },
        {
          text: '취소',
          role: 'cancel',
          cssClass: "my-custom-alert-button-class",
          handler: () => resolve(false),
        },
      ],
      cssClass: "my-custom-alert-class",
    }).then(async (alert) => {
      await alert.present();
    });
  });
};

/**
 * 이벤트 생성시 해당 이벤트 메시지 알림 토스트
 * @param message 토스트 메시지
 * @param isCentered (선택) 텍스트를 중앙 정렬할지 여부 (기본값: false)
 */
const presentToast = async (message: string, isCentered:boolean = false) => {
  const toast = await toastController.create({
    message: message,
    cssClass: isCentered ? "top-toast toast-txt-center" : "top-toast",
    duration: 1500,
    position: "top",
    positionAnchor:"backButtonHeader"
  });

  await toast.present();
}
</script>

<template>
  <IonPage>
    <GameExitHeader id="backButtonHeader" :header-title="`라운드 ${gameState.currentRound}`" @buttonClick="gameExit"/>

    <!-- Round 1일 때 -->
    <GameRound0neView
      :game-state="gameState"
      :is-host="isHost"
      v-if="gameState.currentRound === 1"
      :order-assigned="orderAssigned"
    />

    <!-- Round 2일 때 -->
    <!-- 말하는 이 화면 -->
    <SpeakerView
      v-if="gameState.currentRound === 2 && isSpeaker"
      :game-state="gameState"
      @next-turn="handleNextTurn"
    />
    <!-- 듣는 이 화면 -->
    <ListenerView
      v-if="gameState.currentRound === 2 && !isSpeaker"
      :game-state="gameState"
      @next-turn="handleNextTurn"
    />
</IonPage>
</template>

<style scoped>
.ion-page {
  background-image: url('../../../assets/img/typetest/bg-type-test-page.png'); /* 이미지를 직접 넣는 방법 */
}
</style>