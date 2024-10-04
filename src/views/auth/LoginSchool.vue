<script setup lang="ts">
import LoginHeader from "@/views/auth/components/LoginHeader.vue";
import {IonPage, IonContent, IonInput, IonText, IonLabel, modalController } from "@ionic/vue";
import SchoolSearchModal from "@/components/auth/SchoolSearchModal.vue";
import LoginFooter from "@/views/auth/components/LoginFooter.vue";
import {ref } from "vue";

// 학교 이름 및 상세주소 관리
const schoolName = ref('');
const isButtonDisabled = ref(true);

const openModal = async () => {
  const modal = await modalController.create({
    component: SchoolSearchModal
  });

  await modal.present();

  const {data, role} = await modal.onWillDismiss();

  if(role === 'confirm') {
    schoolName.value = `${data}`;
    validateForm();
  }
};

// 버튼 활성화/비활성화 관리
const validateForm = () =>{
  isButtonDisabled.value = schoolName.value === '';
};

</script>

<template>
  <IonPage style="justify-content: normal">
    <LoginHeader></LoginHeader>
    <IonContent scroll-y="false">
      <div class="title">
        <ion-text class="title-text">
          다니고 있는 학교를
          <br>
          알려주세요
        </ion-text>
      </div>
      <div class="input-wrapper">
        <!-- 재학중인 학교 -->
        <div class="section-wrapper">
          <ion-label class="section-title">재학 중인 학교</ion-label>
          <ion-input
              v-model="schoolName"
              type="text"
              maxlength="20"
              color="dark"
              fill="outline"
              aria-label="schoolName input"
              placeholder="학교 이름, 지번 또는 도로명 검색"
              class="section-input"
              readonly
              @click="openModal"
          ></ion-input>
      </div>
      </div>
    </IonContent>
    <LoginFooter :isButtonDisabled="isButtonDisabled"></LoginFooter>
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

.section-wrapper{
  margin-bottom: 3vh ;
}

.section-title{
  font-weight: bold;
}

.section-input{
  --background: #fff;
  --color: #000;
  --padding-bottom: 2vh;
  --padding-end: 2vh;
  --padding-start: 2vh;
  --padding-top: 2vh;
  --border-radius: 12px;
  --border-width: 2px;
  border-color:#A3A9B0;
  margin-top: 1vh;
}

</style>