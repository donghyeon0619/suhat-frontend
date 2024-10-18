<script setup lang="ts">
import LoginHeader from "@/views/auth/components/LoginHeader.vue";
import {IonPage, IonContent, IonInput, IonText, IonLabel, IonIcon, IonItem, modalController } from "@ionic/vue";
import SchoolSearchModal from "@/components/auth/SchoolSearchModal.vue";
import LoginFooter from "@/views/auth/components/LoginFooter.vue";
import {ref } from "vue";
import {closeCircle, searchSharp} from "ionicons/icons";
import CheckmarkIcon from "@/components/common/CheckmarkIcon.vue";

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
  <IonPage>
    <LoginHeader></LoginHeader>
    <IonContent class="ion-padding" scroll-y="false">
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
              aria-label="schoolName input"
              placeholder="학교 이름, 지번 또는 도로명 검색"
              class="section-input"
              readonly
              @click="openModal"
            >
              <!-- Icon at the start -->
              <ion-icon class="search-icon" slot="start" :icon="searchSharp" aria-hidden="true"></ion-icon>
              <ion-icon v-if="schoolName" class="close-icon" slot="end" :icon="closeCircle" aria-hidden="true" style="font-size: 1.2rem; color:#626A75"></ion-icon>
            </ion-input>
      </div>
      </div>
    </IonContent>
    <LoginFooter :isButtonDisabled="isButtonDisabled"></LoginFooter>
  </IonPage>
</template>

<style scoped>
.title {
  height: 13%;
  display: flex;
  align-items: center;
  margin-bottom: 8%;
  color: #191F28;
}

.title-text {
  font-size: 1.625rem;
  font-weight: 700;
  line-height: 1.23;
}

.section-wrapper{
  margin-bottom: 3vh ;
}

.section-title{
  font-size: 1rem;
  line-height: 1.25;
  font-weight: 600;
  color: #191F28;
}

.section-input{
  margin-top: 2vh;
  --color: #191F28;
  --padding-start: 2vh;
  --padding-end: 2vh;
  --padding-top: 2vh;
  --padding-bottom: 2vh;
  --border-width: 2px;
  --border-style:solid;
  border: 1.4px solid #EBECEE;
  --placeholder-color: #A3A9B0;
  --highlight-color-focused: tranparent;
  border-radius: 12px;
}

.search-icon{
  font-size: 1.2rem;
  margin-right: 5%;
}

.close-icon{
  font-size: 1.2rem;
  color:#626A75;
}

</style>