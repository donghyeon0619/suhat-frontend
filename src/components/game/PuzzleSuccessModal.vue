<script setup lang="ts">
import {IonContent, IonFooter, IonButton, modalController, IonImg, IonText} from "@ionic/vue";
import PuzzleAcquiredTxt from "@/assets/img/game/text-puzzle-acquired.svg"
import PuzzlePieceIcon from "@/assets/icons/game/icon-puzzle-piece.svg"
import ChatBubbleWithBorder from "@/components/common/ChatBubbleWithBorder.vue";
const confirm = () => modalController.dismiss(null, 'confirm');
// maxPieces prop을 정의하고 기본값을 6으로 지정합니다.
// 구조 분해하여 maxPieces 변수를 선언 (기본값 6)
const { maxPieces = 6 } = defineProps<{ maxPieces?: number }>();


</script>
<template>
  <IonContent :scroll-y="false">
    <div class="puzzle-acquired-content">
      <IonImg class="puzzle-acquired-text-img" :src="PuzzleAcquiredTxt"/>
      <IonThumbnail class="puzzle-piece-wrapper">
        <IonImg :src="PuzzlePieceIcon"/>
      </IonThumbnail>
      <div class="puzzle-text">
      <IonText class="puzzle-title">퍼즐조각 x1</IonText>
      <IonText class="puzzle-description">조각 {{ maxPieces }}개 획득 시 그림을 완성할 수 있어요 </IonText>
      </div>
    </div>
    <div class="chat-bubble-wrapper">
      <ChatBubbleWithBorder
        message=
          "퍼즐조각 1개를 획득했어!
          <br>나머지 조각을 모아 퍼즐을 완성해보자">
      </ChatBubbleWithBorder>
    </div>
  </IonContent>
  <IonFooter class="ion-no-border">
    <div class="action-button">
      <IonButton expand="block" @click="confirm">알았어!</IonButton>
    </div>
  </IonFooter>
</template>

<style scoped>
ion-content::part(background) {
  background: transparent;
}

.puzzle-acquired-text-img{
  width: 75%;
}

.puzzle-acquired-content{
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 13vh;
}

.puzzle-piece-wrapper{
  background: #FFFFFF;
  padding: 1.6vh 2vh 1.8vh 1.8vh;
  margin-top: 7vh;
  margin-bottom: 3vh;
  border: 3.2px solid #13bd7e;
  border-radius: 20px;
  box-shadow: 0 0 42px rgba(167, 242, 215, 0.6);
}

.puzzle-piece-wrapper ion-img{
  width: 14vw;
}

.puzzle-text{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.puzzle-title{
  font-size: 1.25rem; /* 20px */
  line-height: 1.4; /* Ratio-based line-height */
  font-weight: 700; /* Bold */
  margin-bottom: 0.5vh;
  color: #ffffff;
}

.puzzle-description{
  font-size: 0.875rem; /* 14px */
  line-height: 2; /* Ratio-based line-height */
  font-weight: 500; /* Medium */
  color: rgba(255,255,255,0.8);
}

.chat-bubble-wrapper{
  position: absolute;
  bottom: 3%;
  left: 50%;
  transform: translateX(-50%);
  width: 91%;
}

ion-footer{
  height: 15%;
}
.action-button{
  margin: 1vh 2vh 1vh 2vh;
  ion-button {
    --border-radius: 16px;
    --background: #13BD7E;
    font-weight: 700;
    font-size:1rem;
    line-height: 1.25rem;
    --padding-top: 2vh;
    --padding-bottom: 2vh;
  }
}
</style>