<script setup lang="ts">
import LoginHeader from "@/views/auth/components/LoginHeader.vue";
import {IonPage, IonFooter, IonContent, IonInput,IonText} from "@ionic/vue";
</script>

<template>
  <IonPage style="justify-content: normal">
    <login-header></login-header>
    <IonContent scroll-y="false">
      <div class="title">
        <ion-text class="title-text">
          반가워요!
          <br>
          이름을 알려주세요
        </ion-text>
      </div>
      <div class="input-wrapper">
      <ion-input
          color="dark"
          fill="outline"
          aria-label="name input"
          placeholder="성함을 입력해주세요"
          class="name-input"
      ></ion-input>
      </div>
    </IonContent>
    <IonFooter class="ion-no-border">
      <div class="action-button">
        <ion-button expand="block">다음</ion-button>
      </div>
    </IonFooter>
  </IonPage>
</template>

<style scoped>

ion-content{
  --padding-start: 2vh;
  --padding-end: 2vh;
  --padding-top: 2vh;
  --padding-bottom:2vh;
}

.title {
  height: 13%;
  display: flex;
  align-items: center;
  margin-bottom: 3vh;
}

.title-text {
  font-size: 24px;
  font-weight: bold;
  line-height: 1.5;
}


.name-input{
  --background: #fff;
  --color: #000;
  --padding-bottom: 2vh;
  --padding-end: 2vh;
  --padding-start: 2vh;
  --padding-top: 2vh;
  --border-radius: 12px;
  --border-width: 2px;
}

ion-footer{
  height: 15%;
}

.action-button{
  margin: 1vh 2vh 1vh 2vh;
}

ion-button {
  --border-radius: 12px;
  --background: #13BD7E;
  font-size:16px;
  --padding-top: 2vh;
  --padding-bottom: 2vh;
}

</style>