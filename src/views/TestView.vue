<script setup lang="ts">
import { ref } from "vue";
import {IonPage, IonContent, toastController, IonButton} from "@ionic/vue";
import VotingResult from "@/components/game/multiplayer/VotingResult.vue";
import GameExitHeader from "@/components/game/GameExitHeader.vue";
import Header from "@/components/common/BackButtonHeader.vue";

// 테스트용 하드코딩된 값
const agreeCount = ref(0);
const disagreeCount = ref(2);

const hello = () => {
  console.log("핼로우")
}

/**
 * 이벤트 생성시 해당 이벤트 메시지 알림 토스트
 */
const presentToast = async (message: string) => {
  const toast = await toastController.create({
    message: message,
    cssClass: "top-toast toast-txt-center",
    duration: 60000,
    position: "top",
    positionAnchor:"backButtonHeader"
  });

  await toast.present();
}

</script>

<template>
  <IonPage>
    <Header
      id="backButtonHeader"
      :show-title="true"
      :header-title="'게임 대기'"
    ></Header>
    <IonContent scroll-y="false" class="ion-padding">
      <div class="game-play-section">
        <div class="interactive-content">
        <!-- 투표 결과 UI -->
          <VotingResult
            :agree-counts="agreeCount"
            :disagree-counts="disagreeCount"
          />
        </div>
      </div>
      <IonButton @click="presentToast"></IonButton>
    </IonContent>
  </IonPage>
</template>

<style scoped>
.ion-page {
  background-image: url('./../assets/img/typetest/bg-type-test-page.png'); /* 이미지를 직접 넣는 방법 */
}

ion-content::part(background) {
  background: transparent;
}

.game-play-section{
  margin-top: 5vh;
  position: relative;
  min-height: 60vh; /* 최소 높이만 지정 */
  width: 100%;
  transition: margin-top 0.5s ease-in-out, min-height 0.5s ease-in-out; /* 모든 변화를 애니메이션 처리 */
}


.interactive-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%; /* Adjust width if necessary */
}

</style>
