<script setup lang="ts">
import {IonPage, IonContent, IonText} from "@ionic/vue";
import SuhatLogo from"@/assets/img/common/logo-suhat.svg"

</script>

<template>
  <IonPage>
    <IonContent class="ion-padding">
      <div class="content-wrapper">
        <IonText class="tagline">청소년 스마트폰 중독방지</IonText>
        <img :src="SuhatLogo" alt="수햇로고">
      </div>
    </IonContent>
  </IonPage>

</template>

<style scoped>
.ion-page{
  background-color: #ffffff;
}

ion-content::part(background) {
  background: transparent;
}

.content-wrapper {
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.tagline {
  font-size: 1rem;
  color: #A3A9B0;
  margin-bottom: 2vh;
}


</style>