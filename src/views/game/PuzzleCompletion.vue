<script setup lang="ts">
import BackButtonHeader from "@/components/common/BackButtonHeader.vue";
import {
  IonPage,
  IonContent,
  IonFooter,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonImg,
  IonThumbnail,
  IonRow,
  IonCol,
  useIonRouter
} from "@ionic/vue";
import ChatBubbleWithBorder from "@/components/common/ChatBubbleWithBorder.vue";
import PuzzleCompletionBadge from "@/assets/icons/game/icon-completion-badge.svg"
import TestPuzzleImg from "@/assets/img/game/puzzle/img-test-puzzle.png"
import SuhatSign from "@/assets/img/common/img-suhat-sign.svg"
import BaseButtonFooter from "@/components/common/BaseButtonFooter.vue";


const router = useIonRouter();

const goHome = () =>{
  router.push("/home");
}
</script>

<template>
<IonPage>
  <BackButtonHeader back-button-color="white"></BackButtonHeader>
  <IonContent class="ion-padding" scroll-y="false">
    <!-- Congratulatory Title -->
    <div class="title-section">
      <IonText class="completion-subtitle">혼자하기 미션</IonText>
      <IonText class="completion-title">퍼즐 완성!</IonText>
    </div>

      <!-- Puzzle Image Card Section -->
      <IonCard class="puzzle-completion-card ion-padding">
        <img class="puzzle-completion-badge" :src="PuzzleCompletionBadge" alt="핼로우"/>
        <IonCardHeader class="card-header">
          <IonCardTitle class="card-title">내 완성 퍼즐</IonCardTitle>
        </IonCardHeader>
        <IonCardContent class="card-content">
          <IonThumbnail class="puzzle-img-wrapper">
            <IonImg :src="TestPuzzleImg" class="puzzle-img"/>
          </IonThumbnail>
          <IonRow class="ion-align-items-center">
            <IonCol size="9" class="puzzle-description-col">
              <IonText class="puzzle-description">
                올바른 스마트폰 이용을 위한 첫 걸음을 내딛은 걸 축하해!
              </IonText>
            </IonCol>
            <IonCol size="3">
                <img :src="SuhatSign" alt="수햇사인" class="suhat-sign" />
            </IonCol>
          </IonRow>
        </IonCardContent>
      </IonCard>
    <div class="chat-bubble-wrapper">
      <ChatBubbleWithBorder
        message=
          "퍼즐을 완성한 걸 축하해!
          <br>이제 스마트폰 없이도 나와 같이 재미있는 일상을 보내보자">
      </ChatBubbleWithBorder>
    </div>
  </IonContent>
  <BaseButtonFooter
    buttonText="끝내기"
    buttonColor="#13BD7E"
    @buttonClick="goHome"
  />
</IonPage>
</template>

<style scoped>
.ion-page{
  background-image: url('../../assets/img/typetest/bg-type-test-page-dark.png'); /* 이미지를 직접 넣는 방법 */
}

ion-content::part(background) {
  background: transparent;
}

.title-section{
  display:flex;
  flex-direction: column;
  align-items: center;
}

.completion-subtitle{
  font-size: 1rem;
  line-height: 1.5; /* Ratio-based */
  font-weight: 600; /* Semibold */
  color: #D9D9D9;
}

.completion-title {
  font-size: 2rem;
  line-height: 1.375; /* Ratio-based */
  font-weight: 700; /* Bold */
  color: #ffffff;
}

.puzzle-completion-card{
  margin: 3vh auto;
  padding-bottom: 0;
  width: 70%;
  position: relative;
  min-height: 40vh;
  --background: #F5F5F5;
  border-radius: 24px;
  contain: none;
  overflow: visible;
}

.card-header{
  align-items: center;
  padding-top:0;
}

.card-title{
  font-weight: 700;
  font-size: 1.125rem;
  color: #59606B;
}

.puzzle-completion-badge{
 position: absolute;
  top: -2vh;
  right: 2vh;
}

.card-content{
  padding-left: 2vw;
  padding-right: 2vw;
  padding-bottom: 0;
}

.puzzle-img-wrapper{
  --size: 100%;
}


.puzzle-description{
  font-size: 0.75rem; /* Equivalent to 12px */
  line-height: 1.833; /* Ratio-based line height */
  font-weight: 700;
  color: #59606B;
}


.chat-bubble-wrapper{
  position: absolute;
  bottom: 3%;
  left: 50%;
  transform: translateX(-50%);
  width: 91%;
}

/* Media Query for Small Devices (e.g., Galaxy S8) */
@media(max-width: 360px) {
}

/* Media Query for Foldable Devices (e.g., Galaxy Z Fold) */
@media  (max-width: 345px) {
  ion-row{
    margin-top: 2vh;
  }
}
</style>