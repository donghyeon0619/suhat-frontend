<script setup lang="ts">
import LoginHeader from "@/components/common/BackButtonHeader.vue";
import {
  IonPage,
  IonContent,
  IonText,
  IonRadioGroup,
  IonItem,
  IonRadio,
  useIonRouter,
} from "@ionic/vue";
import LoginFooter from "@/views/auth/components/LoginFooter.vue";
import { ref, watch} from "vue";
import {useUserStore} from "@/store/user";
import {signup} from "@/api/authService";

// 스토어 변수 선언
const userStore = useUserStore();

// 성별 선택 관리
const selectedSchoolType= ref<number|null>(userStore.schoolType ?? null);
//버튼 비활성화 상태
const isButtonDisabled = ref(selectedSchoolType.value === null);
// 라우터 변수 정의
const router = useIonRouter();

// API 요청중인 상태를 관리하는 변수
const isSubmitting = ref(false);

// 학교타입이 선택되었는지에 따라 버튼 활성화
watch(selectedSchoolType,(newValue) => {
  isButtonDisabled.value = newValue == null; // 유효하면 버튼 활성화, 아니면 비활성화
});

// 선택된 학교타입 값을 다루는 이벤트 함수 함수
const handleSelectionChange= (event: any) =>{
  selectedSchoolType.value = event.detail.value; // 선택 취소 및 변경 시 selectedSchooltype값 변경
}

// 학교를 저장하고 loginFinish로 이동
const saveSchoolAndFinish = async () => {
  // 이미 요청 진행중인지 확인
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  userStore.setSchoolType(selectedSchoolType.value ?? 0);

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
</script>

<template>
  <IonPage>
    <LoginHeader></LoginHeader>
    <IonContent class="ion-padding" scroll-y="false">
      <div class="title">
        <ion-text class="title-text">
          학년을
          <br>
          선택해주세요
        </ion-text>
      </div>
      <div class="input-wrapper">
        <ion-radio-group v-model="selectedSchoolType" allow-empty-selection="true" @ionChange=handleSelectionChange>
          <ion-item :style="{'--border-color': selectedSchoolType == 0 ? '#13BD7E' : '#EBECEE' }" lines="none">
            <ion-radio value="0" justify="space-between">초등학교 1 ~ 3학년</ion-radio>
          </ion-item>
          <ion-item :style="{'--border-color': selectedSchoolType == 1 ? '#13BD7E' : '#EBECEE' }" lines="none">
            <ion-radio value="1" justify="space-between">초등학교 4 ~ 6학년</ion-radio>
          </ion-item>
          <ion-item :style="{'--border-color': selectedSchoolType == 2 ? '#13BD7E' : '#EBECEE' }" lines="none">
            <ion-radio value="2" justify="space-between">중학교</ion-radio>
          </ion-item>
        </ion-radio-group>
      </div>
    </IonContent>
    <LoginFooter :isButtonDisabled="isButtonDisabled" :onConfirm="saveSchoolAndFinish"/>
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

ion-radio::part(container) {
  border-color: transparent;
}

ion-radio::part(mark) {
  background: none;
  border-radius: 0;
}

ion-radio.radio-checked::part(container) {
  background: transparent;
  border-color: transparent;
}

ion-radio.radio-checked::part(mark) {
  width: 2vw;
  height: 1.5vh;
  border-width: 0 2px 2px 0;
  border-style: solid;
  border-color: #13BD7E;
  transform: rotate(45deg);
}

/* 기본 상태의 스타일 */
ion-item {
  --border-color: #EBECEE;
  border-color: #EBECEE;
  --border-style: solid;
  --border-width: 2px;
  margin-bottom: 3vh;
  --border-radius: 12px;
  --padding-top: 0.3vh;
  --padding-bottom: 0.3vh;
}

ion-item[data-selected="true"] {
  --border-color: #13BD7E; /* Selected border color */
  border-color: #13BD7E; /* Directly set border color as well */
}


ion-radio::part(label) {
  color: #A3A9B0; /* 기본 글씨 색상 */
  font-size: 1rem;
  line-height: 1.5;
  font-weight: 500;
}


ion-radio.radio-checked::part(label) {
  color: #13BD7E !important; /* 선택된 상태의 글씨 색상 */
  font-weight: 500;
}

</style>