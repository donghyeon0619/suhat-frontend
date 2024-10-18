<script setup lang="ts">
import {IonPage, IonContent, IonText, IonIcon} from "@ionic/vue";
import LoginFooter from "@/views/auth/components/LoginFooter.vue";
import {ref, onMounted} from "vue";
import lottie from 'lottie-web';
import confettiAnimationData from '@/assets/confetti.json'

// 사용자 이름
const userName = ref("이수햇");

// Lottie 애니메이션을 제어하기 위한 함수
const animationContainer = ref<HTMLElement | null>(null);  // 초기값을 null로 설정

onMounted(() => {
  if (animationContainer.value) {
    setTimeout(() => {
      const anim = lottie.loadAnimation({
        container: animationContainer.value as HTMLElement, // the container to render the animation in
        renderer: 'svg',
        loop: false,
        autoplay: true,
        animationData: confettiAnimationData,
      });
    }, 100); // Delay by 100ms
  }
});


</script>

<template>
  <IonPage>
    <IonContent class="ion-padding" scroll-y="false">
      <div class="center-container">
      <!-- 체크 아이콘과 애니메이션 공간 -->
      <div class="icon-container">
       <!-- 체크아이콘 -->
        <svg width="100" height="100" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.0001 18.3333C14.6025 18.3333 18.3334 14.6023 18.3334 9.99996C18.3334 5.39759 14.6025 1.66663 10.0001 1.66663C5.39771 1.66663 1.66675 5.39759 1.66675 9.99996C1.66675 14.6023 5.39771 18.3333 10.0001 18.3333Z" fill="#13BD7E"/>
          <path d="M8.81694 12.9833C8.65028 12.9833 8.49194 12.9166 8.37528 12.8L6.01694 10.4416C5.77528 10.2 5.77528 9.79996 6.01694 9.55829C6.25861 9.31663 6.65861 9.31663 6.90028 9.55829L8.81694 11.475L13.1003 7.19163C13.3419 6.94996 13.7419 6.94996 13.9836 7.19163C14.2253 7.43329 14.2253 7.83329 13.9836 8.07496L9.25861 12.8C9.14194 12.9166 8.98361 12.9833 8.81694 12.9833Z" fill="none" stroke="white" stroke-width="1.3"/>
        </svg>

        <!-- Lottie 애니메이션 (컨페티) -->
        <div class="confetti-container" ref="animationContainer"></div>

      </div>

      <!-- 가입 완료 메시지 -->
      <div class="message-container">
        <ion-text class="success-message">가입완료!</ion-text>
        <ion-text class="welcome-message">
          반가워요 <span class="user-name">{{ userName }}님</span>
        </ion-text>
        <div class="description">
          <ion-text>
            헷냥이와 함께 중독방지를 시작해봐요
          </ion-text>
        </div>
      </div>

      </div>
    </IonContent>
    <LoginFooter :is-button-disabled="false" button-text="확인"></LoginFooter>
  </IonPage>
</template>

<style scoped>
.center-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}


/* 아이콘을 포함한 상단 공간 */
.icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5vh;
  position: relative;
}

/* Lottie 애니메이션 컨테이너 */
.confetti-container {
  position: absolute;
  width: 100vw;
  will-change: transform, opacity;
  height: 100vh;
  z-index: 10; /* 체크 아이콘 뒤에 오도록 설정 */
}


/* 메시지 및 텍스트 스타일 */
.message-container {
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-top: 3vh;
}

.success-message, .welcome-message{
  font-size:  1.625rem;
  color: #191F28;
  font-weight: 700;
  line-height: 1.23;
}

.user-name {
  color: #13BD7E;
  font-weight: 700;
}

.description {
  margin-top: 1vh;
  font-size: 1rem;
  color: #6B7684;
}


</style>