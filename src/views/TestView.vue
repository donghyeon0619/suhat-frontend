<script setup lang="ts">
import {IonButton, IonModal, IonHeader, IonContent, IonToolbar, IonTitle, IonLabel} from '@ionic/vue';
</script>

<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>App</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <ion-button id="open-modal" expand="block">Open Sheet Modal</ion-button>
    <div class="speech-bubble-wrapper">
      <div
        class="speech-bubble"
      >
        <IonLabel>(설정- 디지털 웰빙 및 자녀 보호기능)에서 확인가능!</IonLabel>
      </div>
    </div>
    <ion-modal trigger="open-modal" :initial-breakpoint="1" :breakpoints="[0, 1]">
      <div class="block">Block of Content</div>
    </ion-modal>
  </ion-content>
</template>

<style scoped>
.block {
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

ion-modal {
  --height: auto;
}
.speech-bubble-wrapper{
  position: absolute;
  top: -20%;
  z-index:100
}

.speech-bubble{
  position: relative;
  background: #13BD7E;
  border-radius: 16px;
  padding: 1vh 1vh;
  width: auto;
  ion-label{
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 2;
    color: white;
  }
}
/* 꼬리 만들기 - 기본적으로 활성화됨 */
.speech-bubble::after {
  content: '';
  position: absolute;
  bottom: 1px;
  left: 15%;
  width: 0;
  height: 0;
  border: 15px solid transparent;
  border-top-color: #13BD7E;
  border-bottom: 0;
  margin-left: -15px;
  margin-bottom: -14px;
}
</style>