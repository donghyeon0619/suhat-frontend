<script setup lang="ts">
import {IonPage, IonContent, IonText, IonFooter} from "@ionic/vue";
import BackButtonHeader from "@/components/common/BackButtonHeader.vue";
import PuzzleProgressChip from "@/components/game/PuzzleProgressChip.vue";
import BaseDoubleButton from "@/components/common/BaseDoubleButton.vue";
import GameCardBg from "@/assets/img/game/bg-game-card.svg"
import testImg from "@/assets/img/game/img-test-phone.png"
</script>
<template>
<IonPage>
  <BackButtonHeader></BackButtonHeader>
  <IonContent class="ion-padding" scroll-y="false">
    <div class="puzzle-progress-wrapper">
      <PuzzleProgressChip :currentPieces="0" :totalPieces="6"/>
    </div>
    <div class="card-container">
      <div class="text-card">
        <img :src="GameCardBg" alt="Background" class="card-background" />
        <IonLabel class="card-text">스마트폰을 <br>손에서 놓지 않음</IonLabel>
      </div>
      <div class="face-card">
        <img :src="GameCardBg" alt="Background" class="card-background" />
        <img :src="testImg" class="card-picture" alt="그림 이미지">
      </div>
    </div>
    <div class="question-box">
      <IonText class="question-box-text"> 이야기를 들은 당신의 생각은?</IonText>
    </div>
  </IonContent>
  <IonFooter class="ion-no-border">
    <BaseDoubleButton isButtonDisabled="false"></BaseDoubleButton>
  </IonFooter>
</IonPage>
</template>

<style scoped>
.ion-page {
  background: #ECEFF4;
}

ion-content::part(background) {
  background: transparent;
}

.puzzle-progress-wrapper{
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-container {
  display: flex;
  gap: 1vw;
  margin: 15vh 0;
}

.text-card,
.face-card {
  position: relative;
  width: 100%;
  min-height: 60vw;
  margin: 0 1vh 0 1vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.card-text, .card-picture {
  text-align: center;
  padding: 1.5vh;
  max-width: 90%;
  z-index: 2;
  color: #000;
  font-weight: bold;
}

.question-box{
  position: absolute;
  bottom: 3%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  padding: 2.5vh 2vh;
  width: 91%;
  display: flex;
  justify-content: center;
  align-items: center;
  .question-box-text{
    font-weight: 700;
    font-size: 1.125rem;
    line-height: 1.75;
  }
}

ion-footer{
  height: 15%;
  padding-top: 1vh;
}

</style>