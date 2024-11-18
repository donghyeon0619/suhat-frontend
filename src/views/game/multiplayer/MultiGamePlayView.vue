<script setup lang="ts">
import {IonPage} from "@ionic/vue";
import BackButtonHeader from "@/components/common/BackButtonHeader.vue";
import GameRound0neView from "@/views/game/multiplayer/GameRound0neView.vue";
import {ref} from "vue";
import SpeakerView from "@/views/game/multiplayer/SpeakerView.vue";

const currentRound = ref(1);

// GameRoundOneView에서 전달받은 이벤트로 라운드 변경
const startNextRound = () => {
currentRound.value = 2;
};

</script>

<template>
  <IonPage>
    <BackButtonHeader id="backButtonHeader" :header-title="`라운드 ${currentRound}`" show-title="true"/>

    <!-- Round 1일 때만 GameRoundOneView를 표시 -->
    <GameRound0neView v-if="currentRound === 1" @nextRound="startNextRound"/>

    <!-- Round 2일 때만 SpeakerView를 표시 -->
    <SpeakerView v-if="currentRound === 2" />
  </IonPage>
</template>

<style scoped>
.ion-page {
  background-image: url('../../../assets/img/typetest/bg-type-test-page.png'); /* 이미지를 직접 넣는 방법 */
}
</style>