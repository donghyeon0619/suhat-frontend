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

// 스토어 변수 선언
const userStore = useUserStore();

// 성별 선택 관리
const selectedGender= ref<number|null>(userStore.gender ?? null);
//버튼 비활성화 상태
const isButtonDisabled = ref(selectedGender.value === null);
// 라우터 변수 정의
const router = useIonRouter();

// 성별이 선택되었는지에 따라 버튼 활성화
watch(selectedGender,(newValue) => {
  isButtonDisabled.value = newValue == null; // 유효하면 버튼 활성화, 아니면 비활성화
});

// 선택된 성별 값을 다루는 이벤트 함수 함수
const handleSelectionChange= (event: any) =>{
  selectedGender.value = event.detail.value; // 선택 취소 및 변경 시 selectedGender값 변경
}

// 성별을 저장하고 LoginSchool로 라우팅
const saveGenderAndProceed = async () => {
  userStore.setGender(selectedGender.value ?? 0);
  router.push('/loginSchool', undefined);
}
</script>

<template>
  <IonPage>
    <LoginHeader></LoginHeader>
    <IonContent class="ion-padding" scroll-y="false">
      <div class="title">
        <ion-text class="title-text">
          성별을
          <br>
          선택해주세요
        </ion-text>
      </div>
      <div class="input-wrapper">
        <ion-radio-group v-model="selectedGender" allow-empty-selection="true" @ionChange=handleSelectionChange>
          <ion-item :style="{'--border-color': selectedGender == 0 ? '#13BD7E' : '#EBECEE' }" lines="none">
            <ion-radio value="0" justify="space-between">남자</ion-radio>
          </ion-item>
          <ion-item :style="{'--border-color': selectedGender == 1 ? '#13BD7E' : '#EBECEE' }" lines="none">
            <ion-radio value="1" justify="space-between">여자</ion-radio>
          </ion-item>
        </ion-radio-group>
      </div>
    </IonContent>
    <LoginFooter :isButtonDisabled="isButtonDisabled" :onConfirm="saveGenderAndProceed"/>
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