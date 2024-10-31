<script setup lang="ts">
import LoginHeader from "@/views/auth/components/LoginHeader.vue";
import {
  IonPage,
  IonContent,
  IonText,
  IonRadioGroup,
  IonList,
  IonItem,
  IonRadio,
  useIonRouter,
  onIonViewWillEnter
} from "@ionic/vue";
import LoginFooter from "@/views/auth/components/LoginFooter.vue";
import {ref, watch} from "vue";
import {getUserInfo, setUserInfo} from "@/store/secureStorage";

// 성별 선택 관리
const selectedGender= ref('');
//버튼 비활성화 상태
const isButtonDisabled = ref(true);
// 라우터 변수 정의
const router = useIonRouter();

// 사용자가 화면에 들어올 때, 저장된 성별 데이터를 불러와서 selectGender에 설정
onIonViewWillEnter(async()=>{
  const userInfo = await getUserInfo();
  selectedGender.value = userInfo?.gender || '';
})

// 성별이 선택되었는지에 따라 버튼 활성화
watch(selectedGender, (newValue) => {
  isButtonDisabled.value = newValue === ''; // 유효하면 버튼 활성화, 아니면 비활성화
});

// 선택된 성별 값을 다루는 이벤트 함수 함수
const handleSelectionChange= (event) =>{
  selectedGender.value = event.detail.value || ''; // 선택 취소 및 변경 시 selectedGender값 변경
}

// 성별을 저장하고 LoginSchool로 라우팅
const saveGenderAndProceed = async () => {
  const existingUserInfo = (await getUserInfo() || {});
  await setUserInfo({...existingUserInfo, gender: selectedGender.value});

  router.push('/loginSchool');
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
          <ion-item :class="{ 'item-selected': selectedGender=== 'man'}" lines="none">
            <ion-radio value="man" justify="space-between">남자</ion-radio>
          </ion-item>
          <ion-item :class="{ 'item-selected': selectedGender === 'woman' }" lines="none">
            <ion-radio value="woman" justify="space-between">여자</ion-radio>
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
  border: 2px solid #EBECEE;
  margin-bottom: 3vh;
  border-radius: 12px;
  --padding-top: 0.3vh;
  --padding-bottom: 0.3vh;
}

ion-radio::part(label) {
  color: #A3A9B0; /* 기본 글씨 색상 */
  font-size: 1rem;
  line-height: 1.5;
  font-weight: 500;
}

/* 선택된 상태의 스타일 */
.item-selected {
  border-color: #13BD7E !important;
}

.item-selected ion-radio::part(label) {
  color: #13BD7E !important; /* 선택된 상태의 글씨 색상 */
  font-weight: 500;
}

</style>