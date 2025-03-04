<script setup lang="ts">
import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonLabel,
  IonImg,
  IonText,
  IonList,
  IonFooter,
  useIonRouter,
  onIonViewWillEnter, onIonViewWillLeave, alertController, toastController
} from "@ionic/vue"
import Header from "@/components/common/BackButtonHeader.vue";
import JsBarcode from 'jsbarcode'
import {ref, computed} from 'vue'
import UserItem from "@/components/game/UserItem.vue";
import BaseButton from "@/components/common/BaseButton.vue";
import {onBeforeRouteLeave, useRoute} from "vue-router";
import {deleteRequest, get, post} from "@/api/httpService";
import {useEventSourceStore} from "@/store/eventSourceStore";
import {useUserStore} from "@/store/user";
import {RoomStatus, useGameStore} from "@/store/gameStore";
import canStartSpeechBubbleImg from "@/assets/img/game/speech-bubble.svg"
import { App } from "@capacitor/app"
import {PluginListenerHandle} from "@capacitor/core";
import { Network } from "@capacitor/network";
import {showAlert} from "@/utils/showAlert";

// capacitorApp 관련 변수
let pauseHandle: PluginListenerHandle | undefined;
let resumeHandle: PluginListenerHandle | undefined;
let networkCheckInterval: ReturnType<typeof setInterval> | null = null;
let resumeAttemptCount = 0; // 재연결 시도횟수를 추적할 수 있음
let isConnecting = false;

const route = useRoute();
const router = useIonRouter();
const roomId = String(route.params.roomId);
const roomName = ref('방 이름');
const headCount = ref(4);
const isHost = ref(false);
const isLeaving = ref(false);

// 실제 입장한 플레이어 배열
const participants = ref<Array<{ playerId: number | null, seatIndex: number | null,  isUserJoined: boolean, ready: boolean, name: string, avatarId: number }>>([]);

// sse 변수 선언
const eventSourceStore = useEventSourceStore();

// pinia 변수 선언
const userStore = useUserStore();
const gameStore = useGameStore();
const roomStatus = computed(() => gameStore.roomStatus);

/**
 * 방 연결
 */
const connectToRoom = () => {
  eventSourceStore.connect(roomId);
};

/**
 * 방 연결 시 이벤트 헨들러
 * @param event
 */
function onConnectedHandler(event: MessageEvent) {
  console.log('[Waiting] connected 이벤트 수신:', event.data);

  // 내 playerId
  const currentUserId = userStore.userInfo.id;

  // 1) 자기 자신 ready
  if (currentUserId !== null) {
    setPlayerReady(currentUserId);
  }

}

// 핸들러 함수 정의
/**
 * 'player-joined' 이벤트: 새로운 플레이어 추가
 * @param event
 */
const playerJoinedHandler = (event: MessageEvent) => {
  console.log('player-joined 이벤트 수신:', event.data);
  addPlayer(event.data);
};

/**
 * 'game-started' 이벤트: 게임 시작 처리 및 페이지 이동
 * @param event
 */
const gameStartedHandler = (event: MessageEvent) => {
  console.log('game-started 이벤트 수신:', event.data);
  gameStore.roomStatus = RoomStatus.IN_GAME;
  router.replace({
    path: `/multi/play/${roomId}`,
  });
};

/**
 * 다시하기 이후 emitter 재갱신을 한 후 레디완료 처리
 * @param event
 */
const playerReconnectedHandler = (event: MessageEvent) => {
  console.log('playerReconnected 이벤트 수신:', event.data);
  const readyPlayerId = JSON.parse(event.data).playerId;
  setPlayerReady(readyPlayerId);

}

/**
 * 'player-left' 이벤트: 플레이어 제거
 * @param event
 */
const playerLeftHandler = (event: MessageEvent) => {
  console.log('player-left 이벤트 수신:', event.data);
  deletePlayer(event.data);
};

/**
 * 재연결시 방에 없을 때, 홈에서 다시 입장
 */
const notInRoomHandler = (event: MessageEvent) => {
  isLeaving.value = true;
  gameStore.roomStatus = RoomStatus.CLOSED;
  eventSourceStore.disconnectByUser();

  presentToast(event.data);
  setTimeout(() => {
    router.replace({
      path: '/game/home'
    })
  }, 1500);
}


/**
 * 'host-assigned' 이벤트:  호스트 부여
 * @param event
 */
const hostAssignedHandler = (event: MessageEvent) => {
  console.log('host-assigned 이벤트 수신:', event.data);
  isHost.value = JSON.parse(event.data).isHost;
  presentToast(JSON.parse(event.data).message);
}

/**
 * 'host-changed' 이벤트:  호스트 변경
 * @param event
 */
const hostChangedHandler = (event: MessageEvent) => {
  console.log('host-changed 이벤트 수신:', event.data);
  presentToast(JSON.parse(event.data).message);
}

/**
 * 참가자 추가 – 중복 없이 immutable하게 업데이트
 * @param data
 */
const addPlayer = (data: any) => {
  const newPlayer = JSON.parse(data);
  console.log('new player:', newPlayer);
  // 중복 여부 확인
  const exists = participants.value.some(p => p.playerId === newPlayer.playerId);

  if (!exists) {
    participants.value = [
      ...participants.value,
      {
        playerId: newPlayer.playerId,
        seatIndex: newPlayer.seatIndex,
        isUserJoined: true,
        ready: newPlayer.ready,
        name: newPlayer.playerInfo.name,
        avatarId: newPlayer.avatarId,
      }
    ];
  } else {
    // 이미 존재하면 ready 상태 업데이트
    participants.value = participants.value.map(p =>
      p.playerId === newPlayer.playerId ? { ...p, ready: newPlayer.ready } : p
    );
  }
  console.log("현재 participants:", participants.value);
};

/**
 * 플레이어를 참가자 리스트에서 제거
 */
const deletePlayer = (data: any) => {
  const leavingPlayerId = Number(data);
  console.log("삭제 전 participants:", participants.value);
  participants.value = participants.value.filter(p => p.playerId !== leavingPlayerId);
  console.log("삭제 후 participants:", participants.value);
}

/**
 * 버튼 클릭 핸들러 - 방장과 일반 플레이어의 동작 분리
 */
const buttonClickHandler = () => {
  if (isHost.value) {
    // 방장인 경우 게임 시작 로직
    startGame();
  } else {
    // 일반 플레이어인 경우 게임방 나가기 로직
    router.back();
  }
}

/**
 * 게임 시작 요청을 서버에 전송
 */
const startGame = async () => {
  try{
    const response = await post(`games/${roomId}/round/1/state`, null, true);

    if(response.status == "200") {
      console.log('게임 시작 요청 성공');
    } else {
      console.error('게임 시작 요청 실패');
    }
    
  } catch (error) {
    console.error('게임 시작 요청 실패: ', error);
  }
};

/**
 * 방 나가기 요청을 서버에 전송
 */
const leaveRoom = async () => {
  if(isLeaving.value){
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

/**
 * 방 상태 적용
 * @param response
 */
const fetchDeTails = (response: any) => {
  // 1) participants를 seatIndex 오름차순으로 정렬해 저장
  const sortedPlayers = response.players.sort((a: any, b: any) => a.seatIndex - b.seatIndex);

  // 서버의 players 객체를 배열로 변환
  participants.value = sortedPlayers.map((player: any) => ({
    playerId: player.playerId,
    seatIndex: player.seatIndex,
    isUserJoined: true,
    ready: player.ready,
    name: player.playerInfo.name,
    avatarId: player.avatarId,
  }));
  console.log("fetch 이후 participants 상태:", participants.value);
  gameStore.roomStatus = RoomStatus.WAITING;

  // 호스트 여부 확인
  const currentUserId = userStore.userInfo.id;
  if(response.hostId === currentUserId) {
    isHost.value = true;
  }
}

/**
 * UI 표시용: headCount 만큼의 배열을 만듭니다.
 * 실제 입장한 플레이어들을 먼저 표시하고, 부족한 만큼은 placeholder로 채웁니다.
 */
const displayParticipants = computed(() => {

  // 1) seatArray: 길이가 headCount인 배열을 만들고 모두 null
  const seatArray = Array(headCount.value).fill(null);

  // 2) participants.value 를 순회하며 seatIndex에 배치
  participants.value.forEach(p => {
    if (p.seatIndex !== null && p.seatIndex >= 0 && p.seatIndex < headCount.value) {
      seatArray[p.seatIndex] = p;
    }
  });

// 3) seatArray에서 null인 곳은 placeholder로
  return seatArray.map(slot => {
    if (!slot) {
      return {
        playerId: null,
        seatIndex: -1,
        isUserJoined: false,
        ready: false,
        name: ''
      };
    }
    return slot;
  });
});

/**
 * 플레이어의 ready 상태 업데이트
 */
const setPlayerReady = (playerId: number) => {
  participants.value = participants.value.map(p =>
    p.playerId === playerId ? { ...p, ready: true } : p
  );
  console.log("플레이어 ready 업데이트:", participants.value);
};

/**
 * 페이지가 뷰에 표시되기 직전에 호출됨
 */
onIonViewWillEnter(async () => {
  // 초기 데이터 로드
  try {
    const response = await get(`rooms/${roomId}`);

    if(response.roomStatus === "IN_GAME"){
      gameStore.roomStatus = RoomStatus.IN_GAME;
      console.log("게임이 이미 시작되었습니다. 게임 화면으로 이동합니다");
      router.replace(`/multi/play/${roomId}`);
      return;
    }

    fetchDeTails(response);

    roomName.value = response.roomName;
    headCount.value = response.totalPlayers;

    createBarcode(roomId);

    // SSE 연결
    connectToRoom();

    // 그 외 이벤트 등록
    eventSourceStore.addEventListener('connected', onConnectedHandler);
    eventSourceStore.addEventListener('not-in-room', notInRoomHandler);
    eventSourceStore.addEventListener('player-joined', playerJoinedHandler);
    eventSourceStore.addEventListener('game-started', gameStartedHandler);
    eventSourceStore.addEventListener('player-left', playerLeftHandler);
    eventSourceStore.addEventListener('host-assigned', hostAssignedHandler);
    eventSourceStore.addEventListener('host-changed', hostChangedHandler);
    eventSourceStore.addEventListener('player-reconnected', playerReconnectedHandler);

    // 앱이 백그라운드로 갈 때
    pauseHandle = await App.addListener('pause', onPauseHandler);

    // 앱이 포그라운드로 돌아올 때
    resumeHandle = await App.addListener('resume', onResumeHandler);

  } catch (error) {
    console.log('방 데이터를 가져오지 못했습니다: ', error);
  }
});

/**
 * 앱이 백그라운드로 갈떄 처리하는 핸들러
 */
function onPauseHandler() {
  console.log("[GameWaiting] onPause -> disconnect SSE");
  eventSourceStore.disconnectByUser();
  const response = get(`rooms/${roomId}/canRqInPause`);
  console.log("api 응답:", response);
}

/**
 * 앱이 다시 포그라운드로 올떄 sse 연결을 다시 하는 핸들러
 */
async function onResumeHandler() {
  // 다시 SSE를 연결하기
  if (isLeaving.value) {
    console.log("[GameWaiting] 이미 방을 나갔으므로 SSE 재연결 생략");
    return;
  }

  // 이미 연결이 살아 있는지 확인하는 코드
  if (eventSourceStore.isConnected) {
    return;
  }

  console.log("[GameWaiting] onResume -> reconnect SSE if needed");

  setTimeout(async () => {
    // 네트워크 상태 확인
    try {
      const status = await Network.getStatus();
      if (status.connected) {
        console.log("[GameWaiting] network is connected, let's reconnect SSE");
        await attemptReconnect();
      } else {
        // 네트워크 미연결이면 재시도 로직
        scheduleNetworkRetry();
      }
    } catch (error) {
      console.error("[GameWaiting] resume 시 방 상태 갱신 실패:", error);
    }
  }, 2000);
}

/**
 * 일정 간격으로 Network 상태를 재확인 후, 연결되면 SSE 재연결
 */
function scheduleNetworkRetry() {

  // 이미 interval이 있거나, 이미 isConnecting이면 skip
  if (networkCheckInterval || isConnecting || eventSourceStore.isConnected) {
    return;
  }

  resumeAttemptCount = 0;
  networkCheckInterval = setInterval(async () => {
    resumeAttemptCount++;
    console.log(`[GameWaiting] Checking network again (#${resumeAttemptCount})...`);

    try {
      const status = await Network.getStatus();
      if (status.connected) {
        console.log("[GameWaiting] 네트워크 재연결 성공, 네트워크 체크 인터벌 삭제");
        clearInterval(networkCheckInterval!);
        networkCheckInterval = null;
        await attemptReconnect();  //
      } else if (resumeAttemptCount > 5) {
        console.error("[GameWaiting] 네트워크 연결이 안되므로 오류 발생");
        clearInterval(networkCheckInterval!);
        networkCheckInterval = null;
      }
    } catch (err) {
      console.error("[GameWaiting] scheduleNetworkRetry -> 네트워크 상태 가져오기 실패:", err);
    }
  }, 2000);
}

/**
 * 재연결 함수
 */
const attemptReconnect = async () => {

  // 이미 연결 시도 중이면 스킵
  if (isConnecting) {
    console.log("[GameWaiting] 재연결이 이미 진행중이므로 스킵합니다");
    return;
  }
  isConnecting = true;

  // sse 재연결
  console.log("[GameWaiting] Attempting SSE 재연결 시도중");

  // 방 상태 조회
  try {
    const response = await get(`rooms/${roomId}`);

    // Fetch 응답 데이터에서 현재 사용자가 방에 있는지 확인
    const userInRoom = response.players.some((player: any) => player.playerId === userStore.userInfo.id);
    if(!userInRoom) {
      console.log("[GameWaiting] Fetch 응답: 현재 사용자가 방에 존재하지 않습니다.");
      await presentToast("방에 존재하지 않습니다. 홈으로 이동합니다.");
      gameStore.roomStatus = RoomStatus.CLOSED;
      router.replace("/game/home");
      return;
    }

    if (response.roomStatus === "IN_GAME") {
      console.log("[GameWaiting] FETCH 응답: 게임이 이미 시작되었습니다.");
      gameStore.roomStatus = RoomStatus.IN_GAME;
      router.replace(`/multi/play/${roomId}`);
    } else {
      connectToRoom(); // SSE 재연결
      console.log("[GameWaiting] FETCH 응답: 대기실 정보 업데이트");
      fetchDeTails(response);
    }
  } catch (error) {
    await showAlert(
     "조회 에러",
     "방 정보 조회 실패", [
        {
          text: "확인", role: "confirm",
        }
      ]
    )
  } finally {
    isConnecting = false;
  }
}

/**
 * 페이지를 떠날 때 리스너 제거
 */
onIonViewWillLeave(() => {
  console.log('Leaving GameWaiting, cleaning up listeners');
  eventSourceStore.removeEventListener('connected', onConnectedHandler);
  eventSourceStore.removeEventListener('player-joined', playerJoinedHandler);
  eventSourceStore.removeEventListener('player-left', playerLeftHandler);
  eventSourceStore.removeEventListener('game-started', gameStartedHandler);
  eventSourceStore.removeEventListener('host-assigned', hostAssignedHandler);
  eventSourceStore.removeEventListener('host-changed', hostChangedHandler);
  eventSourceStore.removeEventListener('player-reconnected', playerReconnectedHandler);
  eventSourceStore.removeEventListener('not-in-room', notInRoomHandler);

  if (pauseHandle) {
    pauseHandle.remove();
    pauseHandle = undefined;
  }

  if (resumeHandle) {
    resumeHandle.remove();
    resumeHandle = undefined;
  }
  resetRoomState();
})


/**
 * 방 초기화 함수
 */
const resetRoomState = () => {
  isLeaving.value = false;
  isHost.value = false;
}

/**
 * 현재 참가자 수 계산
 */
const currentParticipantCount = computed(() => {
  // 실제 입장한 참가자 수 (placeholder는 포함하지 않음)
  return participants.value.length;
});

/**
 * 방이 꽉 찼는지 여부 확인
 */
const isRoomFull = computed(() => currentParticipantCount.value === headCount.value);

/**
 * 방에 있는 모든 인원이 준비완료했는지 확인
 */
const allPlayerReady = computed(() => {
  return participants.value.every((p => p.ready));
})

const imageUrl = ref('');


/**
 * 방 코드 바코드 생성
 * @param roomId
 */
const createBarcode = (roomId: any) => {
  const canvas = document.createElement('canvas');
  JsBarcode(canvas, roomId, { height: 50, width: 2, lineColor: "#333D4B", displayValue: true, text: "방 코드 : " + roomId, textMargin: 3, fontSize: 20, fontOptions: "bold", margin: 2 });
  imageUrl.value = canvas.toDataURL('image/png'); // 캔버스를 이미지 URL로 변환
};


/**
 * 라우팅전 네비게이션 가드 함수
 */
onBeforeRouteLeave(async (to, from, next) => {

  // 이미 나가기 중일떄,
  if (isLeaving.value) {
    return next(); // 게임시작중이면 네비가이션 가드 우회;
  }

  // 방이 닫혔거나 game 중일떄
  if (roomStatus.value === RoomStatus.CLOSED || roomStatus.value === RoomStatus.IN_GAME) {
    return next();
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
 */
const presentToast = async (message: string) => {
  const toast = await toastController.create({
    message: message,
    cssClass: "top-toast toast-txt-center",
    duration: 1500,
    position: "top",
    positionAnchor:"backButtonHeader"
  });

  await toast.present();
}

</script>

<template>
  <IonPage>
    <Header
      id="backButtonHeader"
      :show-title="true"
      :header-title="'게임 대기'"
    ></Header>
    <ion-content class="ion-padding" scroll-y="false">
      <!-- 바코드 화면 -->
      <ion-card class="container no-shadow">
        <ion-card-content>
          <ion-img class="barcode" v-if="imageUrl" :src="imageUrl" alt="바코드 이미지" style="width: 80%; height: auto;"></ion-img>
          <ion-card class="description ion-no-margin no-shadow">
            <img src="@/assets/icons/game/scan-icon.svg" class="scan-icon" alt="스캔 아이콘">
            해당 바코드를 스캔 후 방에 입장할 수 있어요
          </ion-card>
          <div class="horizontal-division">
            <ion-card-subtitle>방 이름<span class="vertical-division"></span>
              <ion-label>{{roomName}}</ion-label>
            </ion-card-subtitle>
            <ion-card-subtitle>인원 수<span class="vertical-division"></span>
              <ion-label>{{headCount}}인 게임</ion-label>
            </ion-card-subtitle>
          </div>
        </ion-card-content>
      </ion-card>

      <!-- 참여자 안내 화면 -->
      <ion-card class="container no-shadow">
        <ion-card-content>
          <div class="title-wrap">
            <ion-text class="title">입장 인원</ion-text>
            <ion-text class="current-participant"><span>{{ currentParticipantCount }}</span>/{{headCount}}명</ion-text>
          </div>

          <ion-list class="ion-no-padding">
            <UserItem
              v-for="(participant, index) in displayParticipants"
              :key="participant.playerId !== null ? `player-${participant.playerId}` : `placeholder-${index}`"
              :isUserJoined="participant.isUserJoined"
              :name="participant.isUserJoined ? participant.name : '아직 입장하지 않음'"
              :is-ready="participant.ready"
              :avatar-id="participant.avatarId"
            />
          </ion-list>
        </ion-card-content>
      </ion-card>
    </ion-content>

    <ion-footer class="ion-padding-start ion-padding-end ion-padding-bottom ion-no-border">
      <ion-img class="start-speech-bubble ion-margin-start" v-if="isHost && isRoomFull && allPlayerReady" :src="canStartSpeechBubbleImg"></ion-img>
      <BaseButton :buttonText="isHost ? '게임시작' : '게임 나가기'" :isButtonDisabled="isHost ? !(isRoomFull && allPlayerReady) : false" @click="buttonClickHandler"></BaseButton>
    </ion-footer>
  </IonPage>
</template>

<style scoped>
.ion-page {
  background-image: url("../../assets/img/green-background.svg");
  background-position: center;
  background-size: cover;
}

ion-content::part(background) {
  background: transparent;
}

ion-toolbar {
  --background: transparent;
}

.container {
  height: max-content;
  margin: 0 0 10px 0;
  --padding: 10px;
  border-radius: 16px;
  border: 2px solid #C7E399;

  ion-list {
    min-height: 35vh;
  }
}

.current-participant {
  --background: transparent;
  color: #09834C;

  span {
    color: #13BD7E;
  }
}

ion-label {
  color: #191F28;
}

ion-card-content {
  padding: 5vw;
}

ion-card-title {
  display: inline-block;
  --color: #191F28;
  font-weight: bold;
  font-size: 2.3vh;

  ion-text {
    color: #191F28;
  }
}

.title-wrap {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 2vh;

  .title {
    color: #191F28;
  }
}

ion-card-subtitle {
  --color: #6B758F;
  margin: 10px 0 0 0;
}

ion-card-subtitle ion-label{
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.425;
}

.barcode {
  margin: auto;
}

.description {
  display:flex;
  align-items:center;
  justify-content: center;
  text-align: center;

  --background: #333D4B;
  --color: white;
  border-radius: 8px;
  padding: 5px;
  font-size: 12px;
  margin: 20px 0;
}

.scan-icon {
  display: inline-block;
  width: max-content;
}

.horizontal-division {
  border-top: 2px solid #F0F2F4;
  padding-top: 5px;
}

.vertical-division {
  border-right: 2px solid #F0F2F4;
  margin: 0 15px;
}

.no-shadow {
  box-shadow: none;
}

ion-footer {
  position: relative;
  margin: 0 0 20px 0;
}

.start-speech-bubble {
  position: absolute;
  width: 50%;
  bottom: 110%;
  left: 25%;
  transform: translateX(-50%);
  z-index: 10;
}
</style>