<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonContent,
  IonToolbar,
  IonButtons,
  IonFooter,
  IonButton,
  IonImg,
  IonGrid,
  IonRow,
  IonCol,
  IonThumbnail,
  IonLabel,
  actionSheetController, useIonRouter,
} from "@ionic/vue";
import {useRoute} from "vue-router";

import goHome from "@/assets/icons/common/icon-go-home.svg"
import ListIcon from "@/assets/icons/home/icon-list.svg"
import FlagIcon from "@/assets/icons/home/icon-flag.svg"
import XIcon from "@/assets/icons/home/icon-x-orange.svg"
import PeopleIcon from "@/assets/icons/home/icon-people.svg"
import GameIcon from "@/assets/icons/home/icon-game.svg"
import VideoCamIcon from "@/assets/icons/home/icon-videocam.svg"

const showGameModeActionSheet = async () => {
  const actionSheet = await actionSheetController.create({
    header: '가장 많이 사용하는',
    subHeader: '서비스를 골라주세요',
    cssClass: 'select-mode-action-sheet',

    buttons:  [
      {
        text: '소셜미디어(인스타그램, 카카오톡)',
        cssClass: 'select-mode-action-sheet-button ',
        handler() {
          console.log("소셜 미디어 선택");
          router.push({ name: 'TypeTestPage', query: { serviceType: '소셜 미디어' } })
        },
        icon: PeopleIcon
      },
      {
        text: '동영상 플랫폼(넷플릭스, 유튜브)',
        cssClass: 'select-mode-action-sheet-button ',
        handler() {
          console.log("동영상 플랫폼 선택");
          router.push({ name: 'TypeTestPage', query: { serviceType: '동영상 플랫폼' } })
        },
        icon: VideoCamIcon
      },
      {
        text: '모바일 게임',
        cssClass: 'select-mode-action-sheet-button ',
        handler() {
          console.log("모바일 게임 선택");
          router.push({ name: 'TypeTestPage', query: { serviceType: '모바일 게임' } })
        },
        icon: GameIcon
      },
    ]
  });

  await actionSheet.present();
};

const route = useRoute();
const router = useIonRouter();



</script>

<template>
  <IonPage>
    <!-- 헤더 부분 -->
    <IonHeader class="ion-no-border">
      <IonToolbar>
        <IonButtons slot="end">
          <ion-button style="--padding-start: 4vw">
            <ion-img :src="goHome"></ion-img>
          </ion-button>
        </IonButtons>
      </IonToolbar>
    </IonHeader>

    <!-- 메인 컨텐츠 부분 -->
    <IonContent class="ion-padding" scroll-y="false" >

      <!-- 타이틀 부분 -->
      <div class="title-container">
        <IonText class="subtitle-text">
          스마트폰 중독에서 벗어나기 위한
        </IonText>
        <div class="title-text-1-wrapper">
          <img :src="XIcon" alt="x 아이콘" class="x-icon"/>
          <IonText class="title-text">
            중독방지
          </IonText>
        </div>
        <IonText class="title-text">
          퍼즐탐험
        </IonText>
      </div>

      <!-- 로드맵 부분 -->
      <div class="=roadmap-container">

      </div>
    </IonContent>
    <IonFooter class="ion-no-border">
      <IonGrid>
        <IonRow class="button-row ion-justify-content-center">
          <IonCol size="6">
            <IonButton
              expand="block"
              class="type-test-button"
              @click="showGameModeActionSheet"
            >
            <div class="button-content">
              <IonThumbnail style="--size:40%;">
                <img :src="ListIcon" alt="유형검사 아이콘" class="list-icon">
              </IonThumbnail>
              <IonLabel class="button-title">
                유형검사
              </IonLabel>
              <IonLabel class="button-description">
                스마트폰 사용 습관
                <br>
                유형을 살펴보세요
              </IonLabel>
            </div>
            </IonButton>
          </IonCol>
          <IonCol size="6">
            <IonButton
              expand="block"
              class="game-button"
            >
              <div class="button-content">
                <IonThumbnail style="--size:38%;">
                <img :src="FlagIcon" alt="보드게임 아이콘" class="flag-icon">
                </IonThumbnail>
                <IonLabel class="button-title">
                  보드게임
                </IonLabel>
                <IonLabel class="button-description">
                  게임을 통해 나만의
                  <br>
                  퍼즐을 완성해보세요
                </IonLabel>
              </div>
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonFooter>
  </IonPage>
</template>

<style scoped>
.ion-page {
  background-image: url('../../assets/img/home/bg-home.svg');
  background-size:cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  height: 100vh;
  width: 100%;
}


ion-toolbar{
  --background: transparent;
}

ion-content::part(background) {
  background: transparent;
}

ion-buttons{
  margin-right: 0;
}

ion-title{
  display: flex;
}

.title-container{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  letter-spacing: -0.025625rem;
}

.title-text-1-wrapper {
  position: relative;
}


.x-icon{
  position: absolute;
  right: -6%;
  bottom: 5%;
}

.title-text{
  background: linear-gradient(to bottom, #55BB68, #408D47);
  background-clip: text; /* Standard property for broader browser support */
  -webkit-background-clip: text; /* WebKit-specific version */
  -webkit-text-fill-color: transparent; /* WebKit-specific text fill */
  color: transparent; /* Fallback for other browsers */
  font-weight: 400;
  font-size: 4.25rem; /* 68px converted to rem */
  font-family: Jahan 2TF;
}

.subtitle-text{
  font-size: 1.125rem;
  line-height: 1.22;
  color: #55BB68;
  font-weight: 700;
  letter-spacing: -0.025625rem;
  margin-bottom: 3%
}

ion-footer{
  height: 35%;
}

ion-grid{
  --ion-grid-padding: 5%;
}


.button-row{
  background-color: rgba(255, 255, 255, 0.7);
  border: 2px solid #ffffff;
  border-radius: 20px;
  padding:1vh 1vh 1.5vh 1vh;
}

.type-test-button, .game-button{
  --background: white;
  --border-radius: 16px;
  --padding-start: 2vh;
  --padding-end: 2vh;
  --padding-top: 2vh;
  --padding-bottom: 2vh;
  --box-shadow: none;
  height: 100%;
}

.button-content {
  display: flex;
  flex-direction: column;
  letter-spacing: -0.025625rem; /* -0.41px */
  gap:1vh;
}

ion-thumbnail {
  margin: auto; /* Center the thumbnail horizontally */
}

.button-title {
  font-size: 1.125rem;
  line-height: 1.22;
  color: #333D4B;
  font-weight: 700;
}

.button-description{
  font-size: 0.75rem;
  line-height: 1.67;
  color: #6B7684;
  font-weight: 600;
}

/* Media Query for Foldable Devices (e.g., Galaxy Z Fold) */
@media  (max-width: 345px) {
  .type-test-button, .game-button{
    --padding-start: 1vh;
    --padding-end: 1vh;
  }
}

</style>