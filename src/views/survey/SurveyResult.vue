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
  actionSheetController, useIonRouter,
} from "@ionic/vue";
import {useRoute} from "vue-router";

import goHomeIcon from "@/assets/icons/common/icon-go-home.svg"
import trophy from "@/assets/icons/common/icon-trophy.svg"
import lock from "@/assets/icons/common/icon-lock.svg"
import EnvelopFront from "@/assets/img/common/front-envelope.svg"
import EnvelopBack from "@/assets/img/common/back-envelope.svg"
import singleIcon from "@/assets/icons/common/singleplay-icon.svg"
import multiIcon from "@/assets/icons/common/multiplay-icon.svg"
import ChatBubble from "@/components/common/ChatBubble.vue";

const router = useIonRouter();

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
          router.push("/sologame/intro")
        },
        icon: singleIcon
      },
      {
        text: '다른사람과 함께하기',
        cssClass: 'select-mode-action-sheet-button ',
        handler() {
          console.log("같이하기 선택");
          router.push("/game/home")
        },
        icon: multiIcon
      }
    ]
  });

  await actionSheet.present();
};

const route = useRoute();
const score = route.query.score;

const goHome = () => {
  router.replace({
    name: "HomePage",
  });
}

</script>

<template>
  <IonPage>
    <IonHeader class="ion-no-border">
      <IonToolbar>
        <IonButtons slot="end">
          <ion-button
            style="--padding-start: 4vw"
            @click="goHome"
          >
            <ion-img :src="goHomeIcon"></ion-img>
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
      <div class="chat-bubble-wrapper">
        <!-- 말풍선 -->
        <chat-bubble
          :message=
            "`너의 스마트폰 이용습관 접수는 ${score}점이네!<br>그럼 본격적으로 게임을 시작해볼까?`"
        />
      </div>
    </IonContent>
    <IonFooter class="ion-no-border">
      <div class="action-button">
        <IonButton expand="block" @click="showGameModeActionSheet">시작하기</IonButton>
      </div>
    </IonFooter>
  </IonPage>
</template>

<style scoped>
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
  margin-top: 10%; /* 봉투 상단 여백 조정 */
  /* 애니메이션 추가: 1회 실행, ease-out 타이밍 */
  animation: bounce 1s ease-out;
}

.envelope {
  margin-top: 4vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  max-width: 100%;
}

.back-envelope {
  position: absolute;
  bottom: 2%;
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


.chat-bubble-wrapper{
  position: absolute;
  bottom: 3%; /* Adjust as needed to place it above the footer */
  left: 50%;
  transform: translateX(-50%);
  width: 91%; /* Make it take up most of the content width */
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

@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-25px); /* 살짝 위로 */
  }
  50% {
    transform: translateY(0);
  }
  70% {
    transform: translateY(-10px); /* 약간 위로 */
  }
  100% {
    transform: translateY(0);
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