<script setup lang="ts">
import {IonPage, IonContent, IonImg, IonText, IonButton, IonModal} from "@ionic/vue"
import Header from "@/views/auth/components/LoginHeader.vue";
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
          <ion-button class="btn" id="open-modal" onclick="createGameRoom">
            <div class="btn-content">
              <ion-img class="icon" src="src/assets/icons/house.svg"></ion-img>
              <ion-text class="btn-title">방 만들기</ion-text>
              <ion-text class="btn-description">직접 게임을 만들어<br>친구들과 함께해봐요</ion-text>
            </div>
          </ion-button>

          <!-- 입장하기 버튼 -->
          <ion-button class="btn" onclick="enterGameRoom">
            <div class="btn-content">
              <ion-img class="icon" src="src/assets/icons/flag.svg"></ion-img>
              <ion-text class="btn-title">입장하기</ion-text>
              <ion-text class="btn-description">친구가 만든 게임에<br>참여할 수 있어요</ion-text>
            </div>
          </ion-button>
        </div>
      </ion-card>
  </IonPage>

  <ion-modal trigger="open-modal" :initial-breakpoint="1" :breakpoints="[0, 1]">
    <div class="block">
      <ion-title class="modal-title">방만들기</ion-title>

      <ion-title class="modal-title modal-sub-title ion-no-padding">방 이름</ion-title>
      <ion-input fill="outline" placeholder="방 이름을 입력하세요(8자 이하, 특수문자 제외)"></ion-input>

      <ion-title class="modal-title modal-sub-title ion-no-padding">인원</ion-title>
      <ion-checkbox class="checkbox">

      </ion-checkbox>
    </div>
  </ion-modal>
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
  font-size:5.9vw;
  font-weight: bold;
  letter-spacing: 1px;
  line-height: 35px;
}

.img-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.puzzle-lock-img {
  width: 27vh;
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
  font-size: 4.7vw;
  font-weight: bold;
  margin: 10px;
  letter-spacing: 0.1px;
}

.btn-description {
  color: #6B7684;
  font-size: 3.3vw;
  line-height: 20px;
  letter-spacing: 0.1px;
}

.block {
  width: 100%;
  height: 300px;
  padding: 20px;
}

ion-modal {
  --height: auto;
  --border-radius: 24px 24px 0 0;
}

.modal-title {
  margin: 10px 0;
  text-align: center;
  font-size: 4.5vw;
  font-weight: bold;
  --color: #6B7684;
}

.modal-sub-title {
  --color: #191F28;
  text-align: left;
}

::v-deep ion-input::placeholder {
  font-size: 1px;
}

.checkbox {
  border-radius: 10px;
}
</style>
