<script setup lang="ts">
import {IonContent, IonPage, IonCard, IonCardContent, IonCardSubtitle, IonLabel, IonImg, IonText, IonList, IonFooter} from "@ionic/vue"
import Header from "@/components/common/BackButtonHeader.vue";
import JsBarcode from 'jsbarcode'
import {ref, onMounted, computed} from 'vue'
import UserItem from "@/components/game/UserItem.vue";
import BaseButton from "@/components/common/BaseButton.vue";
import {useRoute} from "vue-router";
import axios from "axios";

const roomName = ref('방 이름');
const headCount = ref(4);

const route = useRoute();

onMounted(async () => {
  try {
    const roomId = route.params.roomId;

    const response = await axios.get(`/games/${roomId}`);
    const roomInfo = response.data;

    roomName.value = roomInfo.name;
    headCount.value = roomInfo.headCount;

    createBarcode(roomId);
    getParticipants(roomId);
  } catch (error) {
    console.log('방 데이터를 가져오지 못했습니다. : ', error);
  }
});

const participants = ref(Array(headCount.value).fill({ isUserJoined: false, name: '' }));
const currentParticipantCount = computed(() => {
  return participants.value.filter(p => p.isUserJoined).length;
});
const isRoomFull = computed(() => currentParticipantCount.value === headCount.value);

const imageUrl = ref(null);

const createBarcode = (roomId) => {
  const canvas = document.createElement('canvas');
  JsBarcode(canvas, roomId, { height: 60, width: 3, lineColor: "#333D4B", displayValue: true, text: "방 코드 : " + id, textMargin: 4, fontSize: 11, fontOptions: "bold", margin: 2 });
  imageUrl.value = canvas.toDataURL('image/png'); // 캔버스를 이미지 URL로 변환
};

function getParticipants(roomId) {
  const response = axios.get(`/games/${roomId}/participants`);
  const participantsList = response.data;

  participants.value = participantsList.map((participant, index) => ({
    isUserJoined: true,
    name: participant.name
  }));
}
</script>

<template>
  <IonPage>
    <Header></Header>
    <ion-content class="ion-padding" scroll-y="false">
      <!-- 바코드 화면 -->
      <ion-card class="container no-shadow">
        <ion-card-content>
          <ion-img class="barcode" v-if="imageUrl" :src="imageUrl" alt="바코드 이미지" style="width: 200px; height: auto;"></ion-img>
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
<!--          <ion-card-header class="ion-no-padding">-->
<!--          <ion-card-title>입장 인원</ion-card-title>-->
<!--          </ion-card-header>-->
<!--          <ion-text class="current-participant"><span>{{ currentParticipantCount }}</span>/{{headCount}}</ion-text>-->

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

    <ion-footer class="ion-padding-start ion-padding-end ion-padding-bottom">
      <ion-img class="start-speech-bubble ion-margin-start" v-if="isRoomFull" src="src/assets/icons/game/speech-bubble.svg"></ion-img>
      <BaseButton buttonText="게임시작" :isButtonDisabled="!isRoomFull"></BaseButton>
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