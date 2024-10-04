<script setup lang="ts">
import LoginHeader from "@/views/auth/components/LoginHeader.vue";
import {IonPage, IonContent, IonAccordion,IonAccordionGroup,IonCheckbox, IonItem, IonText} from "@ionic/vue";
import LoginFooter from "@/views/auth/components/LoginFooter.vue";
import {ref, watch}from 'vue';

// 각 체크박스의 상태 관리
const allChecked = ref(false); // 모두 동의 체크박스 상태
const serviceTermsChecked = ref(false); // 첫 번째 약관 체크박스 상태
const privacyChecked = ref(false); // 두 번째 약관 체크박스 상태

// 모두 동의 체크박스를 눌렀을 때 실행
const toggleAllCheckboxes = () => {
  serviceTermsChecked.value = allChecked.value;
  privacyChecked.value = allChecked.value;
};

// 약관 개별 체크박스 상태 변경에 따른 모두 동의 체크박스 상태 변경
watch([serviceTermsChecked, privacyChecked], () => {
  allChecked.value = serviceTermsChecked.value && privacyChecked.value;
});
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
        <!-- 모두 동의하기 체크박스 -->
        <div class="checkbox-all">
          <ion-checkbox
              v-model="allChecked"
              label-placement="end"
              justify="start"
              @ionChange="toggleAllCheckboxes"
          >
            <ion-text>모두 동의합니다.</ion-text>
          </ion-checkbox>
        </div>

        <!-- 개별 약관 체크박스들 -->
        <ion-accordion-group>
          <ion-accordion value="first">
            <ion-item slot="header" lines="none">
              <ion-checkbox
                  v-model="serviceTermsChecked"
                  label-placement="end"
                  justify="start">
              <ion-text class="required">[필수]</ion-text>&nbsp;수햇 서비스 이용약관
              </ion-checkbox>
            </ion-item>
            <div class="ion-padding" slot="content">First Content</div>
          </ion-accordion>
          <ion-accordion value="second">
            <ion-item slot="header" lines="none">
              <ion-checkbox
                  v-model="privacyChecked"
                  label-placement="end"
                  justify="start">
              <ion-text class="required">[필수]</ion-text>&nbsp;개인정보 처리방침
              </ion-checkbox>
            </ion-item>
            <div class="ion-padding" slot="content">Second Content</div>
          </ion-accordion>
        </ion-accordion-group>
      </div>
    </IonContent>
    <login-footer :isButtonDisabled="!(serviceTermsChecked && privacyChecked)"></login-footer>
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
  --checkbox-background-checked: transparent;
  --checkmark-color: #13BD7E;
  --checkbox-background:transparent;
}


ion-checkbox::part(container) {
  border-color: transparent;
}

ion-checkbox::part(mark){
  color:#D0D2D4;
  opacity: 1;
}

.checkbox-all{
  margin-bottom: 2vh;
  background-color: #F2F4F6 ;
  padding: 2vh 2.5vh 2vh 2.5vh;
  border-radius:12px;
}

</style>