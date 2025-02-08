<script setup lang="ts">
import {IonPage, IonContent, IonIcon, IonText, IonInput, IonButton, IonModal, modalController, IonGrid, IonRow, IonCol, useIonRouter} from "@ionic/vue"
import Header from "@/components/common/BackButtonHeader.vue";
import BaseButton from "@/components/common/BaseButton.vue";
import {onMounted, ref} from "vue";
import {chevronForwardOutline} from "ionicons/icons";
import {post} from "@/api/httpService";
import {useUserStore} from "@/store/user";
import {useSurveyStore} from "@/store/survey";
import GameRoomScanner from "@/views/game/GameRoomScanner.vue";

const roomName = ref('');
const errorMessage = ref('');
const selectedHeadCount = ref<number | null>(null);

const router = useIonRouter();
const userStore = useUserStore();
const surveyStore = useSurveyStore();

function validateRoomName() {
  const maxLength = 8;
  const validPattern = /^[a-zA-Z0-9가-힣]*$/; // 영문, 숫자, 한글만 허용

  // 길이 초과 방지
  if (roomName.value.length > maxLength) {
    roomName.value = roomName.value.slice(0, maxLength);
    errorMessage.value = `방 이름은 최대 ${maxLength}자까지 입력 가능합니다.`;
  }

  // 특수문자 제거
  if (!validPattern.test(roomName.value)) {
    roomName.value = roomName.value.replace(/[^a-zA-Z0-9가-힣]/g, '');
    errorMessage.value = '특수문자는 사용할 수 없습니다.';
  }

  errorMessage.value = '';
}

async function createGameRoom() {
  console.log("createGameRoom");
  try {
    const response = await post("rooms", {
      roomName: roomName.value,
      totalPlayers: selectedHeadCount.value,
      hostInfo: userStore.userInfo,
      surveyScore: surveyStore.latestScore
    });

    console.log("roomId: " + response.roomId);
    const roomId = response.roomId;

    closeModal();

    router.push({
      path: `/game/waiting/${roomId}`,
    });
  } catch (error) {
    console.log('방 생성 오류 발생: ', error);
  }
}

async function scanBarcode() {
  closeModal();

  const newModal = await modalController.create({
    component: GameRoomScanner,
    cssClass: "game-room-scanner-modal"
  });

  await newModal.present();
}

function gameTutorial() {
  router.push({
    path: "/game/tutorial"
  });
}

function selectHeadCount(num: number) {
  selectedHeadCount.value = num;
}

function reset() {
  selectedHeadCount.value = null;
  roomName.value = '';
}

function closeModal() {
  modalController.dismiss();
}

onMounted(() => {
  console.log('pinia userInfo: ', userStore.userInfo);
})
</script>

<template>
  <IonPage>
      <Header></Header>
      <ion-content class="ion-padding" scroll-y="false">
        <ion-text class="description">친구들과 함께 퍼즐조각을 모아<br>그림을 완성해보세요!</ion-text>
        <div class="img-container">
          <img src="@/assets/img/puzzle-lock.svg" class="puzzle-lock-img" alt="잠긴 퍼즐 이미지">
        </div>
      </ion-content>

      <ion-card class="ion-no-margin choice-container">
        <ion-text class="title">게임 유형</ion-text>
        <div class="btn-container">
          <!-- 방 만들기 버튼 -->
          <ion-button class="btn" id="create-room-modal">
            <div class="btn-content">
              <img src="@/assets/icons/icon-house.svg" class="icon" alt="집 아이콘">
              <ion-text class="btn-title">방 만들기</ion-text>
              <ion-text class="btn-description">직접 게임을 만들어<br>친구들과 함께해봐요</ion-text>
            </div>
          </ion-button>

          <!-- 입장하기 버튼 -->
          <ion-button class="btn" id="join-room-modal">
            <div class="btn-content">
              <img src="@/assets/icons/home/icon-flag.svg" class="icon" alt="깃발 아이콘">
              <ion-text class="btn-title">입장하기</ion-text>
              <ion-text class="btn-description">친구가 만든 게임에<br>참여할 수 있어요</ion-text>
            </div>
          </ion-button>
        </div>
        <ion-text class="game-description-nav" @click="gameTutorial">
          게임 설명 보러가기
          <ion-icon :icon="chevronForwardOutline"></ion-icon>
        </ion-text>
      </ion-card>

    <!-- 방만들기 모달 -->
    <ion-modal trigger="create-room-modal" :initial-breakpoint="1" :breakpoints="[0, 1]" @didDismiss="reset">
      <div class="block">
        <ion-title class="modal-title">방만들기</ion-title>

        <ion-title class="modal-title modal-sub-title ion-no-padding">방 이름</ion-title>
        <ion-input class="default input-name ion-margin-top ion-margin-bottom"
                   v-model="roomName"
                   fill="outline"
                   placeholder="방 이름을 입력하세요(8자 이하, 특수문자 제외)"
                   @input="validateRoomName"></ion-input>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <ion-title class="modal-title modal-sub-title ion-no-padding">인원</ion-title>
        <div class="btn-container">
          <!-- 3인 게임 선택 버튼 -->
          <ion-button class="btn default"
                      :class="{ 'selected': selectedHeadCount === 3 }"
                      fill="outline"
                      id="open-modal"
                      @click="selectHeadCount(3)">
            <div class="btn-content">
              <img src="@/assets/icons/common/multiplay-icon.svg" class="icon" alt="멀티플레이 아이콘">
              <ion-text class="btn-title">3인 게임</ion-text>
            </div>
          </ion-button>

          <!-- 4인 게임 선택 버튼 -->
          <ion-button class="btn default"
                      :class="{ 'selected': selectedHeadCount === 4 }"
                      fill="outline"
                      @click="selectHeadCount(4)">
            <div class="btn-content">
              <img src="@/assets/icons/common/4-multiplay-icon.svg" class="icon" alt="멀티플레이 아이콘">
              <ion-text class="btn-title">4인 게임</ion-text>
            </div>
          </ion-button>
        </div>

        <BaseButton class="ion-no-margin"
                    :isButtonDisabled="!roomName || !selectedHeadCount"
                    button-text="방 만들기"
                    @click="createGameRoom">
        </BaseButton>
        <div class="cancel-btn">
          <ion-button fill="clear" @click="closeModal">취소</ion-button>
        </div>
      </div>
    </ion-modal>

    <!-- 입장하기 modal 화면 -->
    <ion-modal trigger="join-room-modal" :initial-breakpoint="1" :breakpoints="[0, 1]">
      <div class="block">
        <ion-title class="ion-no-padding ion-margin-top ion-margin-bottom">게임 시작 전 아래의 권한을<br>허용해주세요.</ion-title>
        <ion-card class="access-card ion-no-margin ion-margin-top ion-margin-bottom">
          <ion-card-content>
            <ion-grid>
              <ion-row>
                <ion-col class="camera-img" size="2">
                  <img src="@/assets/icons/game/camera-icon.svg" alt="카메라 아이콘">
                </ion-col>
                <ion-col>
                  <ion-card-title class="ion-padding-start">카메라(필수)</ion-card-title>
                  <ion-card-subtitle class="ion-padding-start">방 입장 시 코드 스캔 또는 촬영</ion-card-subtitle>
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-card-content>
        </ion-card>

        <BaseButton class="ion-no-margin" @click="scanBarcode"></BaseButton>
        <div class="cancel-btn">
          <ion-button fill="clear" @click="closeModal">취소</ion-button>
        </div>
      </div>
    </ion-modal>
  </IonPage>
</template>

<style scoped>
.ion-page {
  background-image: url("../../assets/img/game-home-background.svg");
  background-position: center;
  background-size: cover;
}

ion-content::part(background) {
  background: transparent;
}
ion-toolbar{
  --background: transparent;
}

:deep(ion-back-button::part(icon)) {
  color: white;
}

.description {
  display: flex;
  justify-content: center;
  text-align: center;
  margin: 20px 0;
  color: white;
  font-size:5.9vw;
  font-weight: bold;
  letter-spacing: 1px;
  line-height: 35px;
}

.img-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.puzzle-lock-img {
  width: 27vh;
}

.choice-container {
  border-radius: 24px 24px 0 0;
  padding: 20px;
}

.title {
  display: block;
  margin-bottom: 10px;
  color: black;
  font-size: 4.5vw;
  font-weight: bold;
  letter-spacing: 0.1px;
}

.btn-container {
  display: flex;
  justify-content: space-between;
  margin: 16px 0;

  .btn.selected {
    --border-color: #13BD7E;
  }
}

.btn {
  --background: #F4F6F8;
  --ripple-color: white;
  --border-radius: 16px;
  --box-shadow: 0;
  --padding-top: 25px;
  --padding-bottom: 25px;
  width: 47%;
}

.btn-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.game-description-nav {
  color: #6B7684;
  display: flex;
  justify-content: center;
  align-items: center;

  ion-icon {
    margin-left: 5px;
  }
}

.btn-title {
  display: block;
  color: #333D4B;
  font-size: 4.7vw;
  font-weight: bold;
  margin: 10px;
  letter-spacing: 0.1px;
}

.btn-description {
  color: #6B7684;
  font-size: 3.3vw;
  line-height: 20px;
  letter-spacing: 0.1px;
}

.block {
  width: 100%;
  height: max-content;
  padding: 20px;
}

ion-modal {
  --height: auto;
  --border-radius: 24px 24px 0 0;
}

.modal-title {
  margin: 10px 0 0 0;
  text-align: center;
  font-size: 4.5vw;
  font-weight: bold;
  --color: #6B7684;
}

.modal-sub-title {
  --color: #191F28;
  text-align: left;
}

ion-input {
  --border-radius: 12px !important;
  --highlight-color-focused: #191F28;
  --placeholder-font-weight: smaller;
}

:v-deep(ion-input::placeholder) {
  font-size: 1px;
}

.default {
  --background: white;
  --border-color: #EBECEE;
  --border-radius: 16px;
  --border-width: 1.4px;
  --background-activated: white;
}

.access-card {
  margin: 30px 0;
  border-radius: 12px;
  border: 2px solid #EBECEE;
  box-shadow: none;
}

.camera-img {
  display: flex;
}

ion-card-title {
  color: #333D4B;
  font-size: 2.4vh;
}

ion-card-subtitle {
  color: #A3A9B0;
}

.cancel-btn {
  text-align: center;

  ion-button {
    color: #6A7382;
  }
}
</style>
