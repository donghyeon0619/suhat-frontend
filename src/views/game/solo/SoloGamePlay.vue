<script setup lang="ts">
import {IonPage, IonContent, IonText, IonFooter, modalController, useIonRouter} from "@ionic/vue";
import BackButtonHeader from "@/components/common/BackButtonHeader.vue";
import PuzzleProgressChip from "@/components/game/PuzzleProgressChip.vue";
import BaseDoubleButton from "@/components/common/BaseDoubleButton.vue";
import GameCardBg from "@/assets/img/game/bg-game-card.svg"
import testImg from "@/assets/img/game/img-test-phone.png"
import PuzzleSuccessModal from "@/components/game/PuzzleSuccessModal.vue";
import PuzzleFailureModal from "@/components/game/PuzzleFailureModal.vue";
import {enterAnimation, leaveAnimation} from "@/utils/puzzleModalAnimations";
import {ref} from "vue";
import BaseDoubleButtonFooter from "@/components/common/BaseDoubleButtonFooter.vue";

const currentPieces =ref(0);
const maxPieces = ref(6);
const router = useIonRouter();

// 모든 퍼즐이 모이면 퍼즐 완성화면으로 라우팅
const goPuzzleCompletion = () => {
    router.replace("/puzzlecompletion");
};

// 퍼즐 성공 모달 오픈 함수
const openSuccessModal = async () => {
  const modal = await modalController.create({
    component: PuzzleSuccessModal,
    cssClass: 'puzzle-acquired-modal',
    enterAnimation: enterAnimation,
    leaveAnimation: leaveAnimation,
  });
  await modal.present();

  const {data, role} = await modal.onDidDismiss();

  // 현재 퍼즐 갯수 증가
  if(role === 'confirm'){
    currentPieces.value++;
    if (currentPieces.value >= maxPieces.value) {
      goPuzzleCompletion();
    }
  }
};

// 퍼즐 획득 모달 오픈 함수
const openFailureModal = async () => {
  const modal = await modalController.create({
    component: PuzzleFailureModal,
    cssClass: 'puzzle-acquired-modal',
  });
  await modal.present();
  await modal.onDidDismiss();
};

</script>
<template>
<IonPage>
  <BackButtonHeader></BackButtonHeader>
  <IonContent class="ion-padding" scroll-y="false">
    <div class="puzzle-progress-wrapper">
      <PuzzleProgressChip :currentPieces="currentPieces" :totalPieces="maxPieces"/>
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
  <BaseDoubleButtonFooter
    @button1Click="openFailureModal"
    @button2Click="openSuccessModal"
    />
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
</style>