<script setup lang="ts">
import LoginHeader from "@/views/auth/components/LoginHeader.vue";
import {IonPage, IonFooter, IonContent, IonAccordion,IonAccordionGroup, IonItemIonText, IonCheckbox} from "@ionic/vue";
</script>

<template>
  <IonPage style="justify-content: normal">
    <login-header></login-header>
    <IonContent scroll-y="false">
      <div class="title">
        <ion-text class="title-text">
          서비스 이용을 위해
          <br>
          약관 동의가 필요해요
        </ion-text>
      </div>
      <div class="input-wrapper">
        <ion-accordion-group>
          <ion-accordion value="first">
            <ion-item slot="header">
              <ion-checkbox label-placement="end" justify="start">
              <ion-text class="required">[필수]</ion-text>&nbsp;수햇 서비스 이용약관
              </ion-checkbox>
            </ion-item>
            <div class="ion-padding" slot="content">First Content</div>
          </ion-accordion>
          <ion-accordion value="second">
            <ion-item slot="header">
              <ion-checkbox label-placement="end" justify="start">
              <ion-text class="required">[필수]</ion-text>&nbsp;개인정보 처리방침
              </ion-checkbox>
            </ion-item>
            <div class="ion-padding" slot="content">Second Content</div>
          </ion-accordion>
        </ion-accordion-group>
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

.required{
  color:red;
}

ion-checkbox{
  --checkbox-background-checked: white;
  --checkmark-color: #13BD7E;
}


ion-checkbox::part(container) {
  border-color: white;
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