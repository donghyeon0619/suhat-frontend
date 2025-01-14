<script setup lang="ts">
import {modalController,IonLabel, IonButton, IonIcon, IonText, } from "@ionic/vue";
import {search} from "ionicons/icons";
import GameCardBg from "@/assets/img/game/bg-game-card.svg";
import HintPictureImg from "@/assets/img/game/picture/img-picture-card-3.png"

const closeModal = () => modalController.dismiss();


</script>
<template>
  <div class="modal-container ion-padding">
    <!-- Header -->
    <div class="hint-header">
      <ion-icon class="search-icon" :icon="search" style="font-size: 1.25rem" aria-hidden="true"></ion-icon>
      <IonText class="header-text"> 힌트 보기</IonText>
    </div>

    <!-- Card Section -->
    <div class="card-container">
      <div class="card-wrapper" style="padding-left: 5vw">
        <div class="text-card">
          <img :src="GameCardBg" alt="Background" class="card-background" />
          <IonLabel class="card-text">
            스마트폰을 손에서 놓지 않음
          </IonLabel>
        </div>
        <div class="card-title"><IonLabel>글자 카드</IonLabel></div>
      </div>
      <div class="card-wrapper" style="padding-right: 5vw">
        <div class="face-card">
          <img :src="GameCardBg" alt="Background" class="card-background" />
          <Img :src="HintPictureImg" class="card-picture"/>
        </div>
        <div class="card-title"><IonLabel>그림 카드</IonLabel></div>
      </div>
    </div>

    <!-- Hint Description -->
    <div class="description-section ion-padding">

      <div class="description-header">
        <IonText>예시 답안</IonText>
      </div>
      <IonText class="description">
        스마트폰을 손에서 놓지 않으니까 손목이 아파졌어. 손목이 아프지 않으려면 스마트폰 사용을 줄일 필요가 있었어
      </IonText>
    </div>

    <!-- Footer -->
    <div class="footer">
      <IonButton
        class="action-button"
        expand="block"
        @click="closeModal">확인</IonButton>
    </div>
  </div>
</template>
<style scoped>
.modal-container {
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 2vh;
}

.hint-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap:2%;
  margin-top: 1vh;
}

.header-text{
  font-size: 1.25rem;
  line-height: 1.75;
  font-weight: 600;
  color: #191F28;
}

.card-container {
  display: flex;
  justify-content: center;
}

.card-wrapper{
  width:100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.text-card,
.face-card {
  position: relative;
  width: 100%;
  min-height: 40vw;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom:1vh
}

.card-background {
  position: absolute;
  top: 0;
  height: 100%;
  z-index: 1;
}

.card-text, .card-picture {
  text-align: center;
  z-index: 2;
  font-weight: 700;
  font-size: 0.875rem;
  line-height: 1.7;
  color: #ffffff;
}
.card-text {
  max-width: 65%;
}
.card-picture{
  max-width: 60%;
}
.card-title{
  font-weight: 600;
  color: #6B7684;
  font-size: 1rem;
}

.description-section {
  display: flex;
  flex-direction: column;
  background: #F4F6F8;
  border-radius: 16px;
  gap: 2vh;
}

.description-header ion-text{
  background: #13BD7E;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 999px;
  padding: 2% 3%;
  color: white;
}

.description{
  font-size: 1rem;
  line-height: 1.5;
  font-weight: 500;
  color: #333D4B;
}

.action-button {
  --border-radius: 16px;
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.25rem;
  --padding-top: 2vh;
  --padding-bottom: 2vh;
  --background: #13BD7E;
}
</style>