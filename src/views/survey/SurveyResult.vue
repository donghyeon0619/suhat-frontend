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
  IonThumbnail,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonLabel,
  IonChip,
  IonAvatar,
  actionSheetController,
} from "@ionic/vue";
import {useRoute} from "vue-router";

import goHome from "@/assets/icons/common/icon-go-home.svg"
import trophy from "@/assets/icons/common/icon-trophy.svg"
import lock from "@/assets/icons/common/icon-lock.svg"
import suhat from "@/assets/img/suhat_smal.svg"
import EnvelopFront from "@/assets/img/common/front-envelope.svg"
import EnvelopBack from "@/assets/img/common/back-envelope.svg"
import singleIcon from "@/assets/icons/common/singleplay-icon.svg"
import multiIcon from "@/assets/icons/common/multiplay-icon.svg"
import SuhatChip from "@/components/common/SuhatChip.vue";


const showGameModeActionSheet = async () => {
  const actionSheet = await actionSheetController.create({
    header: '게임 방식을 선택해주세요',
    cssClass: 'select-mode-action-sheet',
    buttons:  [
      {
        text: '혼자하기',
        cssClass: 'select-mode-action-sheet-button ',
        handler() {
          console.log("혼자하기 선택");
        },
        icon: singleIcon
      },
      {
        text: '다른사람과 함께하기',
        cssClass: 'select-mode-action-sheet-button ',
        handler() {
          console.log("같이하기 선택");
        },
        icon: multiIcon
      }
    ]
  });

  await actionSheet.present();
};

const route = useRoute();
const score = route.query.score;


</script>

<template>
  <IonPage>
    <IonHeader class="ion-no-border">
      <IonToolbar>
        <IonButtons slot="end">
          <ion-button style="--padding-start: 4vw">
            <ion-img :src="goHome"></ion-img>
          </ion-button>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent class="ion-padding" >
      <div class="envelope-container">
        <div class="envelope">
          <!-- 뒷부분 봉투 -->
          <div class="back-envelope">
            <IonThumbnail style="--size:100%;">
              <ion-img :src="EnvelopBack"></ion-img>
            </IonThumbnail>
          </div>

          <!-- 앞부분 봉투 -->
          <div class="front-envelope">
            <IonThumbnail style="--size:100%;">
              <ion-img :src="EnvelopFront"></ion-img>
            </IonThumbnail>
          </div>

        <!-- 카드 -->
        <IonCard class="custom-card">
          <IonCardHeader>
            <ion-item lines="none">
              <IonThumbnail style="margin-right: 3vw; --size:2.5vh">
                <ion-img :src="trophy"></ion-img>
              </IonThumbnail>
              <IonLabel class="card-title">내 점수</IonLabel>
              <IonLabel slot="end" class="score">{{score}}점</IonLabel>
            </ion-item>
          </IonCardHeader>
          <IonCardContent>
            <div class="content-wrapper">
              <ion-label class="type-text">내 이용 습관 유형</ion-label>
              <div class="lock-img-wrapper">
                  <ion-img :src="lock" style="width:25%; height: auto"></ion-img>
              </div>
            </div>
          </IonCardContent>
        </IonCard>
        </div>
      </div>
      <div class="chat-wrapper">
        <!-- 말풍선 -->
        <div class="speech-bubble">
          <IonLabel>
            너의 스마트폰 이용습관 점수는 96점이네!<br>
            그럼 본격적으로 게임을 시작해볼까?
          </IonLabel>
        </div>
        <SuhatChip/>
      </div>

    </IonContent>
    <IonFooter class="ion-no-border">
      <div class="action-button">
        <IonButton expand="block" @click="showGameModeActionSheet">시작하기</IonButton>
      </div>
    </IonFooter>
    <IonActionSheet
        class="custom-action-sheet"
        trigger="showGameModeActionSheet"
        header="게임 방식을 선택해주세요"
        :buttons="actionSheetButtons"
    ></IonActionSheet>
  </IonPage>
</template>

<style scoped>
.suhat-chip{
  position: absolute;
  top: -3vh;
  z-index: 2;
}

.chat-wrapper{
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 10vh;
}

.speech-bubble{
  position: relative;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  padding: 2vh;
  ion-label{
    font-weight: 700;
    font-size: 1.125rem;
    line-height: 1.75;
  }
}

/* 꼬리 만들기 */
.speech-bubble::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 15%;
  width: 0;
  height: 0;
  border: 15px solid transparent;
  border-top-color: white;
  border-bottom: 0;
  margin-left: -15px;
  margin-bottom: -15px;
}


.ion-page {
  background: #F6F7F9
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

.envelope-container{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: relative;
  margin-top: 20%; /* 봉투 상단 여백 조정 */
}

.envelope {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  max-width: 100%;
}

.back-envelope {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1;
  width: 100%;
}

.front-envelope {
  position: absolute;
  bottom: 0;
  z-index: 3;
  width: 100%;
}


.custom-card {
  position: relative;
  z-index: 2;
  border-radius: 24px;
  text-align: center;
  align-items: center;
  padding: 2% 4%;
  width: 90%;
  box-shadow: none;
  margin-bottom: 15%

}

ion-item{
  --background: #F6F7F9;
  --border-radius: 12px;
  --padding-bottom:0.5vh;
  --padding-top:0.5vh;
  --padding-start:3.5vh;
  --padding-end: 3.5vh;
}

.card-title, .score{
  font-size: 1.25rem ;
  line-height: 1.25;
  font-weight: 700;
}

.card-title{
  color : #59606B;
}

.score{
  color: #13BD7E;
}

.content-wrapper{
  margin-top: 5%;
  padding: 2vh;
  background: #F6F7F9;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.type-text {
  font-size: 0.875rem;
  line-height: 1.25;
  color: #59606B;
  font-weight: 700;
}

.lock-img-wrapper{
  margin-top: 5%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #EAEDF4;
  width: 90%; /* 기존 80%에서 증가 */
  height: 17vh; /* 높이를 추가하여 더 공간 확보 */
  border-radius: 10px;
}


ion-footer{
  height: 13%;
}


.action-button{
  margin: 1vh 2vh 1vh 2vh;
  ion-button {
    --border-radius: 16px;
    --background: #333333;
    font-weight: 700;
    font-size:1rem;
    line-height: 1.25rem;
    --padding-top: 2vh;
    --padding-bottom: 2vh;
  }
}

/* 갤럭시 S8 (기본적으로 작은 스마트폰 해상도) */
@media screen and (max-width: 360px) {
  .card-title, .score{
    font-size: 1rem ;
    font-weight: 600;
  }


  .envelope-container{
    margin-top: 0;
  }

  .speech-bubble ion-label{
    font-size: 1rem;
    font-weight: 650;
    line-height: 1.6;
  }
}

/* 갤럭시 Z Fold (접힌 상태) */
@media screen and (min-width: 413px) and (max-width: 500px) {

}

/* 갤럭시 Z Fold (펼친 상태) */
@media screen and (min-width: 501px) and (max-width: 800px) {
}

</style>