<script setup lang="ts">
import LoginHeader from "@/views/auth/components/LoginHeader.vue";
import {
  IonPage,
  IonContent,
  IonAccordion,
  IonAccordionGroup,
  IonThumbnail,
  IonItem,
  IonText,
  IonLabel, useIonRouter
} from "@ionic/vue";
import LoginFooter from "@/views/auth/components/LoginFooter.vue";
import {reactive, watch} from 'vue';
import CheckmarkIcon from "@/components/common/CheckmarkIcon.vue";
import {useStore} from "vuex";

const store =useStore()

// 라우터 변수 선언
const router = useIonRouter();

// 각 체크박스의 상태 관리
const checkboxes = reactive({
  allChecked: false,
  serviceTerms: false,
  privacyPolicy: false
});

const toggleCheckbox = (key: keyof typeof checkboxes) => {
  checkboxes[key] = !checkboxes[key];
};

// 모두 동의 체크박스를 눌렀을 때 실행
const toggleAllCheckboxes = () => {
  checkboxes.allChecked = !checkboxes.allChecked;
  checkboxes.serviceTerms = checkboxes.allChecked;
  checkboxes.privacyPolicy = checkboxes.allChecked;
};

// 약관 개별 체크박스 상태 변경에 따른 모두 동의 체크박스 상태 변경
watch([() => checkboxes.serviceTerms, () => checkboxes.privacyPolicy], () => {
  checkboxes.allChecked = checkboxes.serviceTerms && checkboxes.privacyPolicy;
});


// userInfo 초기화 및 loginName 라우팅
const initUserInfoAndProceed = async () => {
  await store.dispatch("user/resetUserInfo");
  router.push('/loginName');
}


</script>

<template>
  <IonPage>
    <login-header></login-header>
    <IonContent class="ion-padding" scroll-y="false">

      <!-- 타이틀 부분 -->
      <div class="title">
        <ion-text class="title-text">
          서비스 이용을 위해
          <br>
          약관 동의가 필요해요
        </ion-text>
      </div>


      <div class="input-wrapper">

        <!-- 모두 동의하기 체크박스 -->
        <ion-item class="checkbox-all" lines="none" @click="toggleAllCheckboxes">
          <IonThumbnail>
            <CheckmarkIcon :fillColor="checkboxes.allChecked ? '#13BD7E' : '#D0D2D4'" />
          </IonThumbnail>
          <IonLabel class="checkbox-all-text">모두 동의합니다.</IonLabel>
        </ion-item>

        <!-- 개별 약관 체크박스들 -->
        <ion-accordion-group :multiple="true">
          <!-- 서비스 이용약관 체크 박스 -->
          <ion-accordion value="first">
            <ion-item class="checkbox-item" slot="header" lines="none" >
              <IonThumbnail @click="toggleCheckbox('serviceTerms')">
                <CheckmarkIcon :fillColor="checkboxes.serviceTerms ? '#13BD7E' : '#D0D2D4'" />
              </IonThumbnail>
              <IonLabel class="checkbox-item-text">
                <ion-text class="required">[필수]</ion-text>&nbsp;수햇 서비스 이용약관
              </IonLabel>
            </ion-item>
            <div class="ion-padding" slot="content">First Content</div>
          </ion-accordion>

          <!-- 개인정보 체크 박스 -->
          <ion-accordion value="second">
            <ion-item class="checkbox-item" slot="header" lines="none">
              <IonThumbnail @click="toggleCheckbox('privacyPolicy')">
                <CheckmarkIcon :fillColor="checkboxes.privacyPolicy ? '#13BD7E' : '#D0D2D4'" />
              </IonThumbnail>
              <IonLabel class="checkbox-item-text">
                <ion-text class="required">[필수]</ion-text>&nbsp;개인정보 처리방침
              </IonLabel>
            </ion-item>
            <div class="ion-padding" slot="content">Second Content</div>
          </ion-accordion>
        </ion-accordion-group>
      </div>
    </IonContent>

    <login-footer :isButtonDisabled="!checkboxes.allChecked" button-text="동의하기" :onConfirm="initUserInfoAndProceed"></login-footer>
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

ion-thumbnail{
  margin-right: 3vw;
  --size:3vh;
}

.checkbox-all {
  margin: 0 2% 10% 1%;
  --background: #F2F4F6 ;
  --padding-start: 2.5vh;
  --padding-top:0.7vh;
  --padding-bottom:0.7vh;
  --padding-end:2.5vh;
  --border-radius:12px;
}
.checkbox-all-text{
  font-size: 1rem;
  line-height: 1.5;
  font-weight: 600;
}

.checkbox-item-text, .checkbox-all-text{
  color: #191F28;
}
.checkbox-item{
  --padding-start: 2%;
}

.checkbox-item-text{
  line-height: 1.5;
  font-weight: 500;
}

.required{
  color: #13BD7E;
}


</style>