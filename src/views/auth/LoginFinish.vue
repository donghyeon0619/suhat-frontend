<script setup lang="ts" xmlns="http://www.w3.org/1999/html">
import LoginHeader from "@/views/auth/components/LoginHeader.vue";
import {IonPage, IonContent, IonText, IonIcon} from "@ionic/vue";
import LoginFooter from "@/views/auth/components/LoginFooter.vue";
import {ref} from "vue";
import {checkmarkCircle} from "ionicons/icons";

// 사용자 이름
const userName = ref("이수햇");

</script>

<template>
  <IonPage style="justify-content: normal">
    <LoginHeader></LoginHeader>
    <IonContent scroll-y="false">
      <div class="center-container">
      <!-- 체크 아이콘과 애니메이션 공간 -->
      <div class="icon-container">
        <ion-icon :icon="checkmarkCircle" class="success-icon"></ion-icon>
<!--        <img src="@/assets/confetti.png" alt="confetti" class="confetti"/>-->
      </div>

      <!-- 가입 완료 메시지 -->
      <div class="message-container">
        <IonText class="success-message">가입완료!</IonText>
        <br />
        <IonText class="welcome-message">
          반가워요 <span class="user-name">{{ userName }}님</span>
        </IonText>
        <br />
        <IonText class="description">
          헷냥이와 함께 중독방지를 시작해봐요
        </IonText>
      </div>
      </div>
    </IonContent>
    <LoginFooter :is-button-disabled="false" button-text="확인"></LoginFooter>
  </IonPage>
</template>

<style scoped>

ion-content{
  --padding-start: 2vh;
  --padding-end: 2vh;
  --padding-top: 2vh;
  --padding-bottom:2vh;
}

.center-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 90%;
}


/* 아이콘을 포함한 상단 공간 */
.icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5vh;
  position: relative;
}

.success-icon {
  font-size: 6rem;
  --ionicon-stroke-width: 40;
  color: #13BD7E;
}

.confetti {
  position: absolute;
  top: -20px;
  width: 120px;
  height: auto;
  animation: confetti-fall 2s infinite;
}

/* 메시지 및 텍스트 스타일 */
.message-container {
  text-align: center;
  margin-top: 3vh;
}

.success-message {
  font-size: 1.5rem;
  font-weight: bold;
}

.welcome-message {
  font-size: 1.25rem;
}

.user-name {
  color: #13BD7E;
  font-weight: bold;
}

.description {
  font-size: 0.9rem;
  color: #6B7684;
  margin-top: 1vh;
}


</style>