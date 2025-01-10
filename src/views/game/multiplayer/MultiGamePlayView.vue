<script setup lang="ts">
import {IonPage} from "@ionic/vue";
import BackButtonHeader from "@/components/common/BackButtonHeader.vue";
import GameRound0neView from "@/views/game/multiplayer/GameRound0neView.vue";
import {ref} from "vue";
import SpeakerView from "@/views/game/multiplayer/speaker/SpeakerView.vue";
import ListenerView from "@/views/game/multiplayer/listener/ListenerView.vue";

const currentRound = ref(1);
const isSpeaker = ref(true); // 발언자인지 여부 (서버에서 결정되거나 초기화)

// 예시 참여자 데이터
const Participants = ref([
  { name: "이예지", order: 1, currentPieces: 0 },
  // { name: "김루리", order: 2, currentPieces: 1 },
  { name: "박성호", order: 3, currentPieces: 2 },
  { name: "이윤호", order: 4, currentPieces: 3 },
]);


// GameRoundOneView에서 전달받은 이벤트로 라운드 변경v b
const startNextRound = () => {
  currentRound.value = 2;
};

const handleNextTurn = (nextSpeakerId: number, myRole: "speaker" | "listener") => {
  isSpeaker.value = myRole === "speaker";
}

</script>
<template>
  <IonPage>
    <BackButtonHeader id="backButtonHeader" :header-title="`라운드 ${currentRound}`" show-title="true"/>

    <!-- Round 1일 때 -->
    <GameRound0neView
      :participants="Participants"
      v-if="currentRound === 1"
      @nextRound="startNextRound"
    />

    <!-- Round 2일 때 -->
    <!-- 말하는 이 화면 -->
    <SpeakerView
      v-if="currentRound === 2 && isSpeaker"
      :participants="Participants"
      @next-turn="handleNextTurn"
    />
    <!-- 듣는 이 화면 -->
    <ListenerView
      v-if="currentRound === 2 && !isSpeaker"
      :participants="Participants"
      @next-turn="handleNextTurn"
    />
</IonPage>
</template>

<style scoped>
.ion-page {
background-image: url('../../../assets/img/typetest/bg-type-test-page.png'); /* 이미지를 직접 넣는 방법 */
}
</style>