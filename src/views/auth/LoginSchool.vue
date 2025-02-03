<script setup lang="ts">
import LoginHeader from "@/components/common/BackButtonHeader.vue";
import {
  IonPage,
  IonContent,
  IonInput,
  IonText,
  IonLabel,
  IonIcon,
  modalController,
  useIonRouter,
} from "@ionic/vue";
import SchoolSearchModal from "@/components/auth/SchoolSearchModal.vue";
import LoginFooter from "@/views/auth/components/LoginFooter.vue";
import {computed, ref, watch} from "vue";
import {closeCircle, searchSharp} from "ionicons/icons";
import {signup} from "@/api/authService";
import {useUserStore} from "@/store/user";

// 스토어 변수 선언
const userStore = useUserStore();

// 학교 이름 및 상세주소 관리
const schoolName = ref(userStore.school || '');
const isButtonDisabled = ref(true);
const isModalOpen = ref(false);

// API 요청 중인 상태를 관리하는 변수
const isSubmitting = ref(false);

// 최종 버튼 활성화 상태: 학교명이 유효해야 하고, API 요청 중이 아닐때만 활성화
const finalButtonDisabled =  computed(() => {
  return isButtonDisabled.value || isSubmitting.value;
})

// 라우터 변수 정의
const router = useIonRouter();

const openModal = async () => {
  if(isModalOpen.value) return;
  isModalOpen.value = true;

  const modal = await modalController.create({
    component: SchoolSearchModal
  });

  await modal.present();

  const {data, role} = await modal.onWillDismiss();
  isModalOpen.value = false;

  if(role === 'confirm') {
    schoolName.value = `${data}`;
    validateForm();
  }
};

// 버튼 활성화/비활성화 관리
const validateForm = () =>{
  isButtonDisabled.value = schoolName.value === '';
};

// 학교를 저장하고 loginFinish로 이동
const saveSchoolAndFinish = async () => {
  // 이미 요청 진행중인지 확인
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  userStore.setSchool(schoolName.value);

  try {
    const response = await signup();
    if (response) {
      router.push(
        {
          name: "LoginFinish",
          query: {username: userStore.name}
        }, undefined
      );
    } else {
      console.log("가입 완료 실패")
    }
  } catch (error) {
    console.error("가입완료 중 오류 발생")
  } finally {
    isSubmitting.value = false;
  }
}

// 학교가 선택되었는지에 따라 버튼 활성화
watch(schoolName,(newValue) => {
  isButtonDisabled.value = newValue.trim() === ''; // 유효하면 버튼 활성화, 아니면 비활성화
});
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
    <LoginFooter :isButtonDisabled="finalButtonDisabled" :onConfirm="saveSchoolAndFinish"/>
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