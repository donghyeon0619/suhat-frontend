<script setup lang="ts">
import { ref } from "vue";
import { IonPage, IonContent } from "@ionic/vue";
import VotingResult from "@/components/game/multiplayer/VotingResult.vue";
import GameExitHeader from "@/components/game/GameExitHeader.vue";

// 테스트용 하드코딩된 값
const agreeCount = ref(0);
const disagreeCount = ref(2);

const hello = () => {
  console.log("핼로우")
}
</script>

<template>
  <IonPage>
    <GameExitHeader id="backButtonHeader" :header-title="`라운드 2`" @buttonClick="hello"/>
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
