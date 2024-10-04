<script setup lang="ts">
import LoginHeader from "@/views/auth/components/LoginHeader.vue";
import {IonPage, IonContent, IonInput,IonText} from "@ionic/vue";
import LoginFooter from "@/views/auth/components/LoginFooter.vue";
import {ref, watch} from "vue";

// 이름 입력값 상태 관리
const nameInput = ref('');
const isButtonDisabled = ref(true);

// 입력한 이름이 적절한지 검증
const validateName = (name) => {
  const maxLength = 6; // 글자수 제한 6자
  return name.length > 0 && name.length <= maxLength; // 1자 이상 6자 이하일 때 유효
};

// 입력값이 변경될 때마다 유효성을 체크하고 버튼 활성화 상태 변경
watch(nameInput, (newValue) => {
  isButtonDisabled.value = !validateName(newValue); // 유효하면 버튼 활성화, 아니면 비활성화
});

</script>

<template>
  <IonPage style="justify-content: normal">
    <LoginHeader></LoginHeader>
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
          v-model="nameInput"
          type="text"
          inputmode="text"
          maxlength="6"
          color="dark"
          fill="outline"
          aria-label="name input"
          placeholder="성함을 입력해주세요"
          class="name-input"
      ></ion-input>
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

</style>