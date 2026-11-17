<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonContent,
  IonToolbar,
  IonText,
  IonFooter,
  IonButton,
  IonImg,
  IonThumbnail,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonLabel, useIonRouter,
} from "@ionic/vue";
import {onBeforeRouteLeave, useRoute} from "vue-router";

import trophy from "@/assets/icons/common/icon-trophy.svg"
import lock from "@/assets/icons/common/icon-lock.svg"
import EnvelopFront from "@/assets/img/common/front-envelope.svg"
import EnvelopBack from "@/assets/img/common/back-envelope.svg"


const route = useRoute();
const router = useIonRouter();

// 서버 응답 데이터와 totalScore
const totalScore = route.query.totalScore; // 총 점수
const suhatTypeId = route.query.suhatTypeId;
const name = route.query.name;
const description = route.query.description;
const suggestion = route.query.suggestion;

const goSummary = () => {
  // 제출 처리 후 결과 페이지로 이동
  router.replace({
    name: "TypeTestSummary",
    query:{
      suhatTypeId:suhatTypeId,
      name: name,
      description: description,
      suggestion: suggestion,
    }
  });
};

onBeforeRouteLeave(async (to, from, next) =>{
  //이동하는 경로가 설문조사일때, 뒤로가기 막기
  if (to.name === 'TypeTestPage') {
    next(false);
  } else {
    next();
  }
})
</script>

<template>
  <IonPage>
    <IonHeader class="ion-no-border">
      <IonToolbar>
      </IonToolbar>
    </IonHeader>
    <IonContent class="ion-padding" :scroll-y="false" >
      <div class="title">
        <IonText class="subtitle-text">
          검사 결과
        </IonText>
        <IonText class="title-text" id="first-title">
          스마트폰 이용습관
        </IonText>
        <IonText class="title-text" id="second-title">
          유형 분석완료!
        </IonText>
      </div>

      <div class="content-container">
        <!-- 대화형 말풍선 -->
        <div class="chat-bubble">
          <div class="speech-bubble">
            <IonLabel>
              내 유형은 다음 화면에서 확인해봐!
            </IonLabel>
          </div>
        </div>

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
                <ion-img :src="EnvelopFront" ></ion-img>
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
                  <IonLabel slot="end" class="score">{{totalScore}}점</IonLabel>
                </ion-item>
              </IonCardHeader>
              <IonCardContent>
                <div class="card-content-wrapper">
                  <ion-label class="type-text">내 이용 습관 유형</ion-label>
                  <div class="lock-img-wrapper">
                    <ion-img :src="lock" style="width:25%; height: auto"></ion-img>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          </div>
        </div>
      </div>
    </IonContent>
    <IonFooter class="ion-no-border">
      <div class="action-button">
        <IonButton expand="block" @click="goSummary">내 유형 보러가기</IonButton>
      </div>
    </IonFooter>
  </IonPage>
</template>

<style scoped>
.front-envelope ion-img::part(image){
  width: 100%;
  height:100%;
  object-fit: cover;
}

.ion-page{
  background-image: url('../../assets/img/typetest/bg-type-test-page-dark.png'); /* 이미지를 직접 넣는 방법 */
}

ion-toolbar{
  --background: transparent;
}

ion-content::part(background) {
  background: transparent;
}

.title{
  margin-top: 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 10%;
  color: #ffffff;
  .subtitle-text {
    font-weight: 600;
    line-height: 1.25;
    font-size:1rem;
  }
  .title-text{
    font-weight: bold;
    line-height: 1.375;
    font-size: 2rem;
  }
}

#first-title{
 margin-top:5%;
}

.content-container{
  position: absolute;
  bottom: 5%;
  width: 90%;
  left: 50%;
  transform:translateX(-50%);
}

.chat-bubble{
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 15%;
  margin-left:5%;
}

.speech-bubble{
  position: relative;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  border: 3px solid #F2F2F2;
  padding: 1.5% 10% 2% 6%;
  ion-label{
    font-weight: 900;
    font-size: 0.75rem;
    line-height: 1.25;
    color: #333D4B;
  }
  z-index: 2;
}

/* 꼬리 만들기 */
.speech-bubble::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 15%;
  width: 0;
  height: 0;
  border: 12px solid transparent;
  border-top-color: #D9D9D9; /* 말풍선 배경 색상 */
  border-bottom: 0;
  margin-left: 0;
  margin-bottom: -1.15vh;
  z-index:3;
}

.speech-bubble::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 15%;
  width: 0;
  height: 0;
  border: 14px solid transparent;
  border-top-color: #F2F2F2; /* 테두리 색상 */
  border-bottom: 0;
  margin-left: -2px;
  margin-bottom: -1.65vh;
  z-index: 1;
}


.envelope-container{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: relative;
  margin-top: 3%; /* 봉투 상단 여백 조정 */
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
  margin-bottom: 15%;
  background:#F5F5F5;
}

ion-item{
  --background: #ffffff;
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

.card-content-wrapper{
  margin-top: 5%;
  padding: 2vh;
  background: #ffffff;
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
  background: #F5F5F5;
  width: 90%; /* 기존 80%에서 증가 */
  height: 17vh; /* 높이를 추가하여 더 공간 확보 */
  border-radius: 10px;
}


ion-footer{
  height: 13%;
}


.action-button{
  margin: 2vh;
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