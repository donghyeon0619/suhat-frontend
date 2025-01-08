<script setup lang="ts">
import {IonContent, IonPage, IonCard, IonCardContent, IonCardSubtitle, IonLabel, IonImg, IonText, IonList, IonFooter, useIonRouter} from "@ionic/vue"
import Header from "@/components/common/BackButtonHeader.vue";
import JsBarcode from 'jsbarcode'
import {ref, onMounted, computed} from 'vue'
import UserItem from "@/components/game/UserItem.vue";
import BaseButton from "@/components/common/BaseButton.vue";
import {useRoute} from "vue-router";
import {deleteRequest, get, post} from "@/api/httpService";

const route = useRoute();
const router = useIonRouter();
const roomId = route.params.roomId;
const roomName = ref('방 이름');
const headCount = ref(4);
const isHost = ref(false);
const participants = ref(Array(headCount.value).fill({ isUserJoined: false, name: '' }));

//연결되면 플레이어 목록 불러오기
const connectToRoom = () => {
  const eventSource = new EventSource(`http://localhost:8070/api/rooms/connect/${roomId}`, {
    withCredentials: true,
  });

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log(data.message);

    } catch (error) {
      console.error('SSE 연결 오류 발생: ', error);
    }
  };

  eventSource.addEventListener('connected', function(event) {
    console.log('connected 이벤트 수신:', event.data);
    isHost.value = JSON.parse(event.data).host;
    console.log('isHost: ', isHost.value);
  });

  eventSource.addEventListener('player-joined', function(event) {
    console.log('player-joined 이벤트 수신:', event.data);
    updatePlayer(event.data);
  });

  eventSource.addEventListener('game-started', function(event) {
    console.log('game-started 이벤트 수신:', event.data);
    router.push({
      path: '/multi/play'
    });
  });

  eventSource.addEventListener('player-left', function(event) {
    console.log('player-left 이벤트 수신:', event.data);
    updatePlayer(event.data);
  });

  eventSource.addEventListener('player-order-assigned', function(event) {
    console.log('player-order-assigned 이벤트 수신:', event.data);
  });

  eventSource.onerror = () => {
    console.error('SSE 연결 오류');
    eventSource.close();
  };
};

const updatePlayer = (data) => {
  const newPlayer = JSON.parse(data).playerInfo;
  console.log('new player: ');
  // 새로운 유저 정보를 participants 리스트에 추가
  const emptySlotIndex = participants.value.findIndex(p => !p.isUserJoined);
  if (emptySlotIndex !== -1) {
    participants.value[emptySlotIndex] = {
      isUserJoined: true,
      name: newPlayer.name,
    };
  }
}

const buttonClickHandler = () => {
  if (isHost.value) {
    // 방장인 경우 게임 시작 로직
    startGame();
  } else {
    // 일반 플레이어인 경우 게임방 나가기 로직
    leaveRoom();
  }
}

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

const leaveRoom = async () => {
  try{
    const response = await deleteRequest(`rooms/${roomId}/players`, true);

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

onMounted(async () => {
  // 초기 데이터 로드
  try {
    const response = await get(`rooms/${roomId}`);

    roomName.value = response.roomName;
    headCount.value = response.totalPlayers;

    createBarcode(roomId);

    // SSE 연결
    connectToRoom();

    participants.value = Array(headCount.value).fill({ isUserJoined: false, name: '' });
    console.log(response.players);
    Object.values(response.players).forEach((player, index) => {
      if (index < participants.value.length) {
        participants.value[index] = {
          isUserJoined: true,
          name: player.playerInfo.name // 전달받은 player의 name 필드
        };
      }
    });

  } catch (error) {
    console.log('방 데이터를 가져오지 못했습니다: ', error);
  }
});

const currentParticipantCount = computed(() => {
  return participants.value.filter(p => p.isUserJoined).length;
});
const isRoomFull = computed(() => currentParticipantCount.value === headCount.value);

const imageUrl = ref(null);

const createBarcode = (roomId) => {
  const canvas = document.createElement('canvas');
  JsBarcode(canvas, roomId, { height: 60, width: 2, lineColor: "#333D4B", displayValue: true, text: "방 코드 : " + roomId, textMargin: 4, fontSize: 15, fontOptions: "bold", margin: 2 });
  imageUrl.value = canvas.toDataURL('image/png'); // 캔버스를 이미지 URL로 변환
};
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
      <ion-img class="start-speech-bubble ion-margin-start" v-if="isRoomFull" src="src/assets/icons/game/speech-bubble.svg"></ion-img>
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