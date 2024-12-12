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
  IonLabel, useIonRouter, IonCol, IonGrid, IonRow,
} from "@ionic/vue";
import {useRoute} from "vue-router";
import BulbIcon from "@/assets/icons/common/icon-bulb.svg"
import DigitalMaestro from "@/assets/img/typetest/img-digital-maestro.png"
import WaveCard from "@/assets/img/typetest/bg-wave-card.svg"
import VideoIcon from "@/assets/icons/typetest/icon-video.svg"
import PhotoIcon from "@/assets/icons/typetest/icon-photo.svg"
import {onMounted} from "vue";
import {useTypeTestStore} from "@/store/typeTest";

const route = useRoute();
const router = useIonRouter();

const suhatTypeId = route.query.suhatTypeId;
const name = route.query.name;
const description = route.query.description;
const suggestion = route.query.suggestion;

onMounted( ()=> {
  console.log("Navigating to TypeTestSummary with:", {
    suhatTypeId,
    name,
    description,
    suggestion,
  });
})

const typeTestStore = useTypeTestStore();
const goToRetry = () => {
  // 제출 처리 후 결과 페이지로 이동
  router.navigate({
    name: "TypeTestPage",
    query: {
      id: typeTestStore.currentServiceTypeId,
      name: typeTestStore.currentServiceTypeName,
    }
  },
    "back",
    "replace",
  );
};

const goToEnd = () => {
  // 제출 처리 후 결과 페이지로 이동
  router.navigate({
    name: "HomePage",
  },
    "forward",
    "replace",
  );
};



</script>

<template>
  <IonPage>
    <IonHeader class="ion-no-border">
      <IonToolbar>
      </IonToolbar>
    </IonHeader>
    <IonContent class="ion-padding" scroll-y="false" >
      <!-- 페이지 타이틀 부분 -->
      <div class="title">
        <IonText class="subtitle-text">
          내 이용 습관은
        </IonText>
        <div class="title-row">
          <IonThumbnail style="--size:3.5vh; margin-right: 0.5vh" >
            <IonImg :src="BulbIcon"/>
          </IonThumbnail>
          <IonLabel class="title-text">
            {{name}}
          </IonLabel>
        </div>
      </div>

      <!-- 물결 카드 부분 -->
      <div class="wave-card-container">
        <img :src="WaveCard" class="card-background-image" alt="Background Image">
        <div class="card-content">
          <IonThumbnail class="type-img">
            <IonImg :src="DigitalMaestro"/>
          </IonThumbnail>
          <div class="type-description-wrapper">
            <img :src="PhotoIcon" alt="사진" class="photo-icon">
            <img :src="VideoIcon" alt="비디오" class="video-icon">
            <ion-label class="type-description">
              {{description}}
            </ion-label>
          </div>
          <ion-label class="type-sub-description">{{suggestion}}</ion-label>
        </div>
      </div>

    </IonContent>
    <!-- 하단 영역 -->
    <IonFooter class="ion-no-border">
      <ion-grid>
        <ion-row>
          <ion-col size="5">
            <ion-button
              expand="block"
              class="again-button"
              @click="goToRetry"
            >
              다시하기
            </ion-button>
          </ion-col>
          <ion-col size="7">
            <ion-button
                expand="block"
                class="end-button"
                @click="goToEnd"
            >
              끝내기
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </IonFooter>
  </IonPage>
</template>

<style scoped>
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
  margin-top: 1%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 8%;
  color: #ffffff;
}

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

.title-row{
  display: flex;
  align-items: center;
  margin-top: 7%

}

.wave-card-container {
  position: relative;
  width: 100%;
  height: 63vh;
  padding: 12% 5%;
  margin-top: 18%;
  border-radius: 20px 20px 12px 12px;
  overflow: hidden;
}


.card-background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  object-fit: cover; /* Ensures the image scales appropriately */
  z-index: -1; /* Puts the image behind the content */
}


.card-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.type-img{
  --size:50%;
}

.type-description, .type-sub-description{
  font-weight: 400;
  color:white;
  text-align: center;
}


.type-description-wrapper{
  position: relative;
  margin-top: 12%;
}

.photo-icon, .video-icon{
  position: absolute;
  top: -2vh;
}

.photo-icon{
  left: 25%;
}

.video-icon{
  left: 45%;
}

.type-description{
  font-size: 1.25rem;
  line-height: 1.6;
}

.type-description-wrapper::after {
  content: '';
  position: absolute;
  top:3.2vh;
  left: 0;
  width: 80%;
  height: 1vh;
  background-image: url("../../assets/img/typetest/img-custom-bottom-border.svg");
  background-repeat: no-repeat;
}

.type-sub-description{
  margin-top: 10%;
  font-size: 1rem;
  line-height: 1.65;
}


.again-button, .end-button {
  --border-radius: 16px;
  --border-color: transparent;
  line-height: 1.25;
  font-size:1rem;
  font-weight: 600;
  --padding-start: 5vw;
  --padding-end: 5vw;
  --padding-top: 2vh;
  --padding-bottom: 2vh;
}

ion-footer{
  height: 15%;
}


.again-button{
  color:#FFF;
  --background: #333D4B;
}

.end-button{
  --background: #13BD7E;
}

/* Media Query for Small Devices (e.g., Galaxy S8) */
@media(max-width: 360px){
  .type-description{
    font-size: 1.25rem;
    line-height: 1.6;

  }

  .type-sub-description{
    margin-top: 10%;
    font-size: 1rem;
    line-height: 1.65;
  }

  .wave-card-container {
    margin-top:12%
  }

}

/* Media Query for Foldable Devices (e.g., Galaxy Z Fold) */
@media  (max-width: 345px) {
  .wave-card-container {
    margin-top:30%;
  }

  .type-img {
    --size: 45%;
  }
}


</style>