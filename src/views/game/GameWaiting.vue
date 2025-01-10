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
  alertController, onIonViewWillEnter, onIonViewWillLeave
} from "@ionic/vue"
import Header from "@/components/common/BackButtonHeader.vue";
import JsBarcode from 'jsbarcode'
import {ref, onMounted, computed} from 'vue'
import UserItem from "@/components/game/UserItem.vue";
import BaseButton from "@/components/common/BaseButton.vue";
import {onBeforeRouteLeave, useRoute} from "vue-router";
import {deleteRequest, get, post} from "@/api/httpService";
import {useEventSourceStore} from "@/store/eventSourceStore";

const route = useRoute();
const router = useIonRouter();
const roomId = route.params.roomId;
const roomName = ref('방 이름');
const headCount = ref(4);
const isHost = ref(false);
const isGameStarting = ref(false);
const participants = ref(Array(headCount.value).fill({ playerId: null, isUserJoined: false, name: '' }));

// sse 변수 선언
const eventSourceStore = useEventSourceStore();

/**
 * 방 연결 및 이벤트 리스너 설정
 */
const connectToRoom = () => {

  eventSourceStore.connect(`http://localhost:8080/api/rooms/connect/${roomId}`);


  eventSourceStore.addEventListener('connected', function(event) {
    console.log('connected 이벤트 수신:', event.data);
    isHost.value = JSON.parse(event.data).host;
    console.log('isHost: ', isHost.value);
  });

  // 이벤트 등록
  eventSourceStore.addEventListener('player-joined', playerJoinedHandler);
  eventSourceStore.addEventListener('game-started', gameStartedHandler);
  eventSourceStore.addEventListener('player-left', playerLeftHandler);
};

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
  isGameStarting.value = true;
  router.push({
    path: `/multi/play/${roomId}`,
  });
};

/**
 * 'player-left' 이벤트: 플레이어 제거
 * @param event
 */
const playerLeftHandler = (event: MessageEvent) => {
  console.log('player-left 이벤트 수신:', event.data);
  deletePlayer(event.data);
};

/**
 * 새로운 플레이어를 참가자 리스트에 추가
 */
const addPlayer = (data) => {
  const newPlayer = JSON.parse(data);
  console.log('new player: ', newPlayer);
  // 새로운 유저 정보를 participants 리스트에 추가
  const emptySlotIndex = participants.value.findIndex(p => !p.isUserJoined);
  if (emptySlotIndex !== -1) {
    participants.value[emptySlotIndex] = {
      playerId: newPlayer.playerId,
      isUserJoined: true,
      name: newPlayer.playerInfo.name,
    };
    console.log("들어간 플레이어 정보", participants.value[emptySlotIndex])
  }
}

/**
 * 플레이어를 참가자 리스트에서 제거
 */
const deletePlayer = (data) => {
  const leavingPlayerId = Number(data);

  // participants 배열에서 playerId가 일치하는 항목 찾기
  const playerIndex = participants.value.findIndex(p => p.playerId === leavingPlayerId);

  console.log("playerIndex", playerIndex)
  if (playerIndex !== -1){
    // 해당 슬롯을 초기 상태로 되돌리기
    participants.value[playerIndex] = {
      playerId: null,
      isUserJoined: false,
      name: '',
    };
  }  else {
    console.log(`Player with ID ${leavingPlayerId} not found.`);
  }
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
    leaveRoom();
  }
}

/**
 * 게임 시작 요청을 서버에 전송
 */
const startGame = async () => {
  try{
    const response = await post(`games/${roomId}/round/1/state`, null);

    if(response) {
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
  try{
    const response = await deleteRequest(`rooms/${roomId}/players`, true);
    eventSourceStore.disconnectByUser();

    if(response.status == "200") {
      console.log('게임방 나가기 요청 성공');

      router.push ({
        path: '/game/home'
      });
    } else {
      console.error('게임 나가기 요청 실패', response);
    }

  } catch (error) {
    console.error('게임방 나가기 요청 성공: ', error);
  }
};

/**
 * 페이지가 뷰에 표시되기 직전에 호출됨
 */
onIonViewWillEnter(async () => {
  // 초기 데이터 로드
  try {
    const response = await get(`rooms/${roomId}`);

    roomName.value = response.roomName;
    headCount.value = response.totalPlayers;

    createBarcode(roomId);

    // SSE 연결
    connectToRoom();

    participants.value = Array(headCount.value).fill({ playerId: null, sUserJoined: false, name: '' });
    console.log("마운트 됬을떄", response.players);
    Object.values(response.players).forEach((player, index) => {
      if (index < participants.value.length) {
        participants.value[index] = {
          playerId: player.playerId,
          isUserJoined: true,
          name: player.playerInfo.name // 전달받은 player의 name 필드
        };
      }
    });

  } catch (error) {
    console.log('방 데이터를 가져오지 못했습니다: ', error);
  }
});

/**
 * 페이지를 떠날 때 리스너 제거
 */
onIonViewWillLeave(() => {
  console.log('Leaving GameWaiting, cleaning up listeners');
  eventSourceStore.removeEventListener('player-joined', playerJoinedHandler);
  eventSourceStore.removeEventListener('player-left', playerLeftHandler);
  eventSourceStore.removeEventListener('game-started', gameStartedHandler);
})

/**
 * 현재 참가자 수 계산
 */
const currentParticipantCount = computed(() => {
  return participants.value.filter(p => p.isUserJoined).length;
});

/**
 * 방이 꽉 찼는지 여부 확인
 */
const isRoomFull = computed(() => currentParticipantCount.value === headCount.value);

const imageUrl = ref(null);


/**
 * 방 코드 바코드 생성
 * @param roomId
 */
const createBarcode = (roomId) => {
  const canvas = document.createElement('canvas');
  JsBarcode(canvas, roomId, { height: 50, width: 2, lineColor: "#333D4B", displayValue: true, text: "방 코드 : " + roomId, textMargin: 3, fontSize: 20, fontOptions: "bold", margin: 2 });
  imageUrl.value = canvas.toDataURL('image/png'); // 캔버스를 이미지 URL로 변환
};

/**
 * 라우팅전 네비게이션 가드 함수
 */
onBeforeRouteLeave(async (to, from, next) => {
  if(isGameStarting.value){
    next(); // 게임시작중이면 네비가이션 가드 우회
    return;
  }
  if (eventSourceStore.eventSource) {
    const confirmed = await presentAlert();
    console.log("confirmed", confirmed);
    if (confirmed) {
      // 사용자가 확인을 누르면 방나가기 처리 후 라우팅 진행
      leaveRoom().then(() => {
        next();  // 라우팅 진행
      }).catch((error) => {
        console.error('방나가기 중 오류 발생:', error);
        next(false);
      });
    } else {
      next(false); //사용자가 취소를 누르면 라우팅 취소
    }
  } else {
    // eventSource가 없으면 바로 라우팅 진행
    next();
  }
});

/**
 * 경고창 부분
 */
const presentAlert = async () => {
  return new Promise(async (resolve) =>{
  const alert = await alertController.create({
    header: '방 나가기',
    message: '정말로 방에서 나가시겠습니까?',
    buttons: [
      {
        text: '확인',
        role: 'confirm',
        cssClass: "my-custom-alert-button-class",
        handler: async () => {
          console.log('사용자가 나가기를 선택했습니다.');
          resolve(true); // "나가기" 클릭 시 true 반환
        }
      },
      {
        text: '취소',
        role: 'cancel',
        cssClass: "my-custom-alert-button-class",
        handler: async () => {
          console.log('사용자가 취소를 선택했습니다.');
          resolve(false); // "취소" 클릭 시 false 반환
        }
      },
    ],
    cssClass: "my-custom-alert-class"
  });
  await alert.present();
  // Alert가 닫힌 후 결과값 반환
  });
}
</script>

<template>
  <IonPage>
    <Header
      :show-title="true"
      :header-title="'게임 대기'"
    ></Header>
    <ion-content class="ion-padding" scroll-y="false">
      <!-- 바코드 화면 -->
      <ion-card class="container no-shadow">
        <ion-card-content>
          <ion-img class="barcode" v-if="imageUrl" :src="imageUrl" alt="바코드 이미지" style="width: 80%; height: auto;"></ion-img>
          <ion-card class="description ion-no-margin no-shadow">
            <ion-img class="scan-icon" src="src/assets/icons/game/scan-icon.svg"></ion-img>
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
                v-for="(participant, index) in participants"
                :key="index"
                :isUserJoined="participant.isUserJoined"
                :name="participant.isUserJoined ? participant.name : ''"
            >
            </UserItem>
          </ion-list>
        </ion-card-content>
      </ion-card>
    </ion-content>

    <ion-footer class="ion-padding-start ion-padding-end ion-padding-bottom ion-no-border">
      <ion-img class="start-speech-bubble ion-margin-start" v-if="isHost && isRoomFull" src="src/assets/icons/game/speech-bubble.svg"></ion-img>
      <BaseButton :buttonText="isHost ? '게임시작' : '게임 나가기'" :isButtonDisabled="isHost ? !isRoomFull : false" @click="buttonClickHandler"></BaseButton>
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

::v-deep ion-toolbar {
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