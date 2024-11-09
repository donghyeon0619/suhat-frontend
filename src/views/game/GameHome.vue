<script setup lang="ts">
import {IonPage, IonContent, IonImg, IonText, IonButton} from "@ionic/vue"
import Header from "@/components/common/BackButtonHeader.vue";
</script>

<template>
  <IonPage>
      <Header></Header>
      <ion-content class="ion-padding" scroll-y="false">
        <ion-text class="description">친구들과 함께 퍼즐조각을 모아<br>그림을 완성해보세요!</ion-text>
        <div class="img-container">
          <ion-img class="puzzle-lock-img" src="src/assets/img/puzzle-lock.svg"></ion-img>
        </div>
      </ion-content>

      <ion-card class="ion-no-margin choice-container">
        <ion-text class="title">게임 유형</ion-text>
        <div class="btn-container">
          <!-- 방 만들기 버튼 -->
          <ion-button class="btn">
            <div class="btn-content">
              <ion-img class="icon" src="src/assets/icons/house.svg"></ion-img>
              <ion-text class="btn-title">방 만들기</ion-text>
              <ion-text class="btn-description">직접 게임을 만들어<br>친구들과 함께해봐요</ion-text>
            </div>
          </ion-button>

          <!-- 입장하기 버튼 -->
          <ion-button class="btn">
            <div class="btn-content">
              <ion-img class="icon" src="src/assets/icons/flag.svg"></ion-img>
              <ion-text class="btn-title">입장하기</ion-text>
              <ion-text class="btn-description">친구가 만든 게임에<br>참여할 수 있어요</ion-text>
            </div>
          </ion-button>
        </div>
      </ion-card>
  </IonPage>
</template>

<style scoped>
.ion-page {
  background-image: url("../../assets/img/game-home-background.svg");
  background-position: center;
  background-size: cover;
}

ion-content::part(background) {
  background: transparent;
}

::v-deep ion-toolbar {
  --background: transparent;
}

::v-deep ion-back-button::part(icon) {
  color: white;
}

.description {
  display: flex;
  justify-content: center;
  text-align: center;
  margin: 20px 0;
  color: white;
  font-size:5.7vw;
  font-weight: bold;
}

.img-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.puzzle-lock-img {
  width: 30vh;
}

.choice-container {
  border-radius: 24px 24px 0 0;
  padding: 20px;
}

.title {
  display: block;
  margin-bottom: 10px;
  color: black;
  font-size: 4.5vw;
  font-weight: bold;
  letter-spacing: 0.1px;
}

.btn-container {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
}

.btn {
  --background: #F4F6F8;
  --border-radius: 16px;
  --box-shadow: 0;
  --padding-top: 25px;
  --padding-bottom: 25px;
  width: 47%;
}

.btn-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.btn-title {
  display: block;
  color: #333D4B;
  font-size: 4.5vw;
  font-weight: bold;
  margin: 10px;
  letter-spacing: 0.1px;
}

.btn-description {
  color: #6B7684;
  font-size: 3vw;
  font-weight: bold;
  line-height: 20px;
  letter-spacing: 0.1px;
}
</style>
