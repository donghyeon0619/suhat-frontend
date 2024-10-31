<script setup lang="ts">
import LoginHeader from "@/views/auth/components/LoginHeader.vue";
import {IonPage, IonContent, IonInput, IonText, useIonRouter, onIonViewWillEnter} from "@ionic/vue";
import LoginFooter from "@/views/auth/components/LoginFooter.vue";
import {ref, watch} from "vue";
import {getUserInfo, setUserInfo} from "@/store/secureStorage";

// State to track focus
const isFocused = ref(false);

// 이름 입력값 상태 관리
const nameInput = ref('');
const isButtonDisabled = ref(true);
const router = useIonRouter();

// 사용자가 화면에 들어올 때, 저장된 이름 데이터를 불러와서 nameInput에 설정
onIonViewWillEnter( async () =>{
  const userInfo = await getUserInfo();
  nameInput.value = userInfo?.name || '';
})

// Handle focus event
const handleFocus = () => {
  isFocused.value = true;
};

// Handle blur event
const handleBlur = () => {
  isFocused.value = false;
};

// 입력한 이름이 적절한지 검증
const validateName = (name: string) => {
  const maxLength = 6; // 글자수 제한 6자
  return name.length > 0 && name.length <= maxLength; // 1자 이상 6자 이하일 때 유효
};

// 입력값이 변경될 때마다 유효성을 체크하고 버튼 활성화 상태 변경
watch(nameInput, (newValue) => {
  isButtonDisabled.value = !validateName(newValue); // 유효하면 버튼 활성화, 아니면 비활성화
});

// 이름을 저장하고 loginGender로 라우팅
const saveNameAndProceed = async () => {
  const existingUserInfo = (await getUserInfo() || {});
  await setUserInfo({...existingUserInfo, name:nameInput.value });

  router.push('/loginGender');
}

</script>

<template>
  <IonPage>
    <LoginHeader></LoginHeader>
    <IonContent class="ion-padding" scroll-y="false">
      <!-- 타이틀 부분-->
      <div class="title">
        <ion-text class="title-text">
          반가워요!
          <br>
          이름을 알려주세요
        </ion-text>
      </div>

      <!-- 입력 부분 -->
      <div class="input-wrapper">
      <IonInput
          v-model="nameInput"
          type="text"
          inputmode="text"
          maxlength="6"
          aria-label="name input"
          placeholder="성함을 입력해주세요"
          @ionFocus="handleFocus"
          @ionBlur="handleBlur"
          class="name-input"
      ></IonInput>
      </div>
    </IonContent>
    <LoginFooter :isButtonDisabled="isButtonDisabled" :onConfirm="saveNameAndProceed"/>
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


.name-input{
  --color: #191F28;
  --padding-start: 2vh;
  --padding-bottom: 2vh;
  --padding-end: 2vh;
  --padding-top: 2vh;
  --border-width: 2px;
  --border-style:solid;
  border: 1.4px solid #EBECEE;
  --placeholder-color: #A3A9B0;
  --highlight-color-focused: tranparent;
  border-radius: 12px;
}

.has-focus {
  border: 1.4px solid #191F28 !important;
}
</style>