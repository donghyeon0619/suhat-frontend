<script setup lang="ts">
import {
  alertController,
  IonPage,
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
import {GameState} from "@/types/GameState";
import {useUserStore} from "@/store/user";
import GameExitHeader from "@/components/game/GameExitHeader.vue";
import {AssignedCard} from "@/types/Card";
import {VoteResult} from "@/types/VoteResult";
import {useGameStore} from "@/store/gameStore";

// 라우트 파라미터
const route = useRoute();
const roomId = String(route.params.roomId);
const router = useIonRouter();

// store 변수 선언
const eventSourceStore = useEventSourceStore();
const userStore = useUserStore();
const gameStore = useGameStore();

// 상태 플래그
const orderAssigned = ref(false);
const isHost = ref(false); // 호스트인지 여부
const isSpeaker = ref(true); // 발언자인지 여부 (서버에서 결정되거나 초기화)
const assignedCard = ref<AssignedCard | null>(null);
const timerStartData = ref<{ startTime: number } | null>(null);
const timeExtensionData = ref<{ additionalTime : number } | null>(null);
let timeoutId: ReturnType<typeof  setTimeout> | null = null;
const currentPhase = ref<string>('');
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
    console.error("서버 시간 가져오기 실패:', error)");
    return 0;
  }
}

/**
 * 'game-ended' 이벤트: 플레이어  떠남으로 인한 게임종료
 * @param event
 */
const gameEndedHandler = (event:MessageEvent) =>{
  console.log('game-ended 이벤트 수신:', event.data);

  gameStore.setGameEnded(true);
  const toastMessage = "게임이 종료되어 홈으로 이동합니다.";
  // 메시지를 Toast에 표시
  presentToast(toastMessage);

  setTimeout(() => {
    router.replace({
      path: '/game/home'
    });
  }, 3000);
}

/**
 * 'game-ended' 이벤트: 플레이어  떠남으로 인한 게임종료
 * @param event
 */
const notInRoomHandler = (event:MessageEvent) =>{
  console.log('not-in-room 이벤트 수신:', event.data);

  gameStore.setGameEnded(true);
  const toastMessage = "방에서 나가져서 다시 입장 요청해야합니다.";
  // 메시지를 Toast에 표시
  presentToast(toastMessage);

  setTimeout(() => {
    router.replace({
      path: '/game/home'
    });
  }, 3000);
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

  gameStore.setGameEnded(true);

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

  const currentSpeaker = gameState.players.find(
    (player) => player.playerId === eventData.speakerId
  );

  if(currentSpeaker) {
    currentSpeaker.isSpeaking = true;
  } else {
    console.error(`${eventData.speakerId} 의 플레이어가 존재하지 않습니다.`);
  }

  isSpeaker.value = userStore.id === eventData.speakerId;

  currentPhase.value = isSpeaker.value ? 'speaking' : 'listening';
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
  presentToast(eventData);
  currentPhase.value = 'voting'
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

  // 3. 현재 사용자가 speaker인지 확인
  isSpeaker.value = userStore.userInfo.id === nextSpeakerId;

  // 4. currentPhase를 speaker인지 여부에 따라 설정
  currentPhase.value = isSpeaker.value ? "speaking" : "listening";

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

  // 주기적인 시간 동기화 설정(매 10마다)
  syncInterval.value = setInterval(periodicTimeSync, 600000);

  eventSourceStore.addEventListener("game-ended", gameEndedHandler);
  eventSourceStore.addEventListener("not-in-room",notInRoomHandler)
  eventSourceStore.addEventListener("player-order-assigned", playerOrderAssignedHandler);
  eventSourceStore.addEventListener("round-2-started", roundTwoStartedHandler);
  eventSourceStore.addEventListener("game-reset", gameResetHandler);
  eventSourceStore.addEventListener("card-assigned", cardAssignedHandler);
  eventSourceStore.addEventListener("timer-start", timerStartHandler);
  eventSourceStore.addEventListener("time-extended", timeExtendedHandler);
  eventSourceStore.addEventListener("speaking-end", speakingEndHandler);
  eventSourceStore.addEventListener("vote-result", voteResultHandler);

  // 컴포넌트 재진입 시 `timerStartData` 및 `timeExtensionData` 초기화
  timerStartData.value = null;
  timeExtensionData.value = null;
})

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
  currentPhase.value = '';
  voteResult.value = null;
  isLeaving.value = false;
  if(syncInterval.value) {
    clearInterval(syncInterval.value);
  }
}

/**
 * 페이지를 떠날 때 리스너 제거
 */
onIonViewWillLeave(() => {
  console.log('Leaving MultiGameView, cleaning up listeners');
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

  if(timeoutId) {
    clearTimeout(timeoutId);
  }

  resetGameState();
})

/**
 * 방 나가기 요청을 서버에 전송
 */
const leaveRoom = async (): Promise<boolean> => {
  if (isLeaving.value) {
    return false;
  }
  isLeaving.value = true;
  eventSourceStore.disconnectByUser();

  try{
    const response = await deleteRequest(`rooms/${roomId}/players`, true);

    if(response.status == "200") {
      console.log('게임방 나가기 요청 성공');
      gameStore.setGameEnded(true);
      return true;
    } else {
      console.error('게임 나가기 요청 실패', response);
      return false;
    }
  } catch (error) {
    console.error('게임방 나가기 요청 실패: ', error);
    return false;
  }
};

// 방나가기 함수
const gameExit = async () => {
  router.replace("/game/home");
}

/**
 * 라우팅전 네비게이션 가드 함수
 */
onBeforeRouteLeave(async (to, from, next) => {
  // 게임이 종료되었을 시 라우팅 바로 진행
  if (gameStore.isGameEnded || isLeaving.value) {
    return next();
  }

  const confirmed = await presentAlert();
  if (confirmed) {
    try {
      next();
    } catch (error) {
      next(false);
    }
  } else {
    next(false);
  }
});

/**
 * 방 나갈때 경고창 보여줌
 */
const presentAlert = async () => {
  return new Promise((resolve) => {
    alertController.create({
      header: '방 나가기',
      message: '정말로 방에서 나가시겠습니까? 나가면 게임이 종료됩니다.',
      buttons: [
        {
          text: '확인',
          role: 'confirm',
          cssClass: "my-custom-alert-button-class",
          handler: async () => {
            console.log('사용자가 나가기를 선택했습니다.');
            try {
              const success = await leaveRoom();
              if (success) {
                resolve(true); // "나가기" 클릭 시 true 반환
              } else {
                await presentToast("방나가기 중 오류 발생으로 홈으로 이동");
                resolve(true);
              }
            } catch (error) {
              console.error("방 나가기에 실패:", error);
              await presentToast("방 나가기에 실패했습니다.");
              resolve(false);
            }
          }
        },
        {
          text: '취소',
          role: 'cancel',
          cssClass: "my-custom-alert-button-class",
          handler: () => {
            console.log('사용자가 취소를 선택했습니다.');
            resolve(false); // "취소" 클릭 시 false 반환
          }
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
 */
const presentToast = async (message: string) => {
  const toast = await toastController.create({
    message: message,
    cssClass: "top-toast",
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
      :current-phase="currentPhase"
      @next-turn="handleNextTurn"
    />
    <!-- 듣는 이 화면 -->
    <ListenerView
      v-if="gameState.currentRound === 2 && !isSpeaker"
      :game-state="gameState"
      :current-phase="currentPhase"
      @next-turn="handleNextTurn"
    />
</IonPage>
</template>

<style scoped>
.ion-page {
background-image: url('../../../assets/img/typetest/bg-type-test-page.png'); /* 이미지를 직접 넣는 방법 */
}
</style>