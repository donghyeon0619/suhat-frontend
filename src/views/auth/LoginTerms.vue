<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonAccordion,
  IonAccordionGroup,
  IonThumbnail,
  IonItem,
  IonText,
  IonLabel, useIonRouter, IonHeader, IonToolbar
} from "@ionic/vue";
import LoginFooter from "@/views/auth/components/LoginFooter.vue";
import {reactive, watch} from 'vue';
import CheckmarkIcon from "@/components/common/CheckmarkIcon.vue";
import {useUserStore} from "@/store/user";
import {onBeforeRouteLeave} from "vue-router";

const userStore = useUserStore();

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
  userStore.resetUserInfo();
  router.push('/loginName');
}

/**
 * Login 로직에서 LoginName으로만 넘어가는 거 허용
 */
onBeforeRouteLeave(async (to, from, next) =>{
  if (to.name === 'LoginName') {
    next();
  } else {
    next(false);
  }
})

</script>

<template>
  <IonPage>
    <IonHeader class="ion-no-border">
      <IonToolbar></IonToolbar>
    </IonHeader>
    <IonContent class="ion-padding" :scroll-y="false">
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
              <IonLabel class="checkbox-item-title">
                <ion-text class="required">[필수]</ion-text>&nbsp;수햇 서비스 이용약관
              </IonLabel>
            </ion-item>
            <div class="ion-padding scroll-container" slot="content">
              <p class="checkbox-item-content">
                <strong>제1조(목적)</strong><br />
                이 약관은 이용자가 수햇(이하 "회사")에서 제공하는 서비스(이하 "서비스")를 이용함에 있어
                회사와 이용자 간의 권리·의무 및 책임사항 등을 규정함을 목적으로 합니다.
                <br /><br />
                <strong>제2조(용어의 정의)</strong><br />
                1. "이용자"란 회사의 서비스에 접속하여 이 약관에 따라 서비스를 이용하는 회원 및 비회원을 말합니다.<br />
                2. "회원"이란 회사와 서비스 이용계약을 체결하고 회원 아이디를 부여받아 서비스를 이용하는 자를 의미합니다.<br />
                <br />
                <strong>제3조(약관의 효력 및 변경)</strong><br />
                1. 이 약관은 이용자가 회원가입 시 "동의" 버튼을 누르는 등, 동의 의사를 표시함으로써 효력이 발생합니다.<br />
                2. 회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 이 약관을 변경할 수 있습니다.<br />
                <br />
                <strong>제4조(서비스 이용)</strong><br />
                1. 회사는 특별한 사유가 없는 한 이용자가 서비스 이용에 불편이 없도록 최선을 다합니다.<br />
                2. 이용자는 회사의 운영 정책, 이용 약관 등 각종 규정을 준수해야 합니다.<br />
                <br />
                <strong>제5조(이용자의 의무)</strong><br />
                1. 이용자는 서비스 이용 시 관련 법령 및 이 약관의 규정을 준수해야 합니다.<br />
                2. 이용자는 허위 정보를 제공하거나 타인의 정보를 도용해서는 안 됩니다.<br />
                <br />
                기타 구체적인 서비스 이용 내용은 실제 운영 정책에 따라 추가 또는 수정하실 수 있습니다.
              </p>
            </div>
          </ion-accordion>

          <!-- 개인정보 체크 박스 -->
          <ion-accordion value="second">
            <ion-item class="checkbox-item" slot="header" lines="none">
              <IonThumbnail @click="toggleCheckbox('privacyPolicy')">
                <CheckmarkIcon :fillColor="checkboxes.privacyPolicy ? '#13BD7E' : '#D0D2D4'" />
              </IonThumbnail>
              <IonLabel class="checkbox-item-title">
                <ion-text class="required">[필수]</ion-text>&nbsp;개인정보 처리방침
              </IonLabel>
            </ion-item>
            <div class="ion-padding scroll-container" slot="content">
              <p class="checkbox-item-content">
                <strong>1. 개인정보의 수집 및 이용 목적</strong><br />
                회사는 회원 가입, 고객 상담, 서비스 제공 등을 위해 아래와 같은 개인정보를 수집·이용합니다.<br />
                - 회원 식별 및 본인 확인<br />
                - 서비스 이용 기록, 접속 로그 분석 등을 통한 서비스 개선<br />
                <br />
                <strong>2. 수집하는 개인정보 항목</strong><br />
                - 필수 항목: 이메일, 비밀번호, 휴대전화번호 등<br />
                - 선택 항목: 닉네임, 관심사 등<br />
                <br />
                <strong>3. 개인정보의 보유 및 이용 기간</strong><br />
                - 서비스 이용 기간 동안 보유 및 이용하며, 이용 종료 후 관련 법령에 따라 일정 기간 보관 후 파기합니다.<br />
                <br />
                <strong>4. 개인정보 처리 위탁</strong><br />
                회사는 원활한 서비스 제공을 위해 외부 전문 업체에 개인정보 처리를 위탁할 수 있으며, 위탁 시 관련 법령을 준수합니다.<br />
                <br />
                <strong>5. 개인정보 보호책임자 및 연락처</strong><br />
                - 성명: 홍길동<br />
                - 연락처: 0000-0000, privacy@company.com<br />
                <br />
                기타 자세한 사항은 실제 운영 정책 및 관련 법령을 토대로 작성하시기 바랍니다.
              </p>
            </div>
          </ion-accordion>
        </ion-accordion-group>
      </div>
    </IonContent>

    <login-footer :isButtonDisabled="!checkboxes.allChecked" button-text="동의하기" :onConfirm="initUserInfoAndProceed"></login-footer>
  </IonPage>
</template>

<style scoped>
ion-toolbar{
  --background: transparent;
}
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

.scroll-container {
  max-height: 30vh; /* 높이 제한 */
  overflow-y: auto; /* 세로 스크롤 활성화 */
  padding-right: 3vw;
  padding-left: 3vw;
}

.checkbox-item-title, .checkbox-all-text, .checkbox-item-content {
  color: #191F28;
}

.checkbox-item-content {
  margin: 0;
}
.checkbox-item{
  --padding-start: 2%;
}

.checkbox-item-title{
  line-height: 1.5;
  font-weight: 500;
}


.required{
  color: #13BD7E;
}


</style>