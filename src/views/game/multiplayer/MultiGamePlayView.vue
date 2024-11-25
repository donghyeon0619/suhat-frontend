<script setup lang="ts">
import {IonPage} from "@ionic/vue";
import BackButtonHeader from "@/components/common/BackButtonHeader.vue";
import GameRound0neView from "@/views/game/multiplayer/GameRound0neView.vue";
import {ref} from "vue";
import SpeakerView from "@/views/game/multiplayer/speaker/SpeakerView.vue";
import ListenerView from "@/views/game/multiplayer/listener/ListenerView.vue";

const currentRound = ref(1);
const isSpeaker = ref(false); // 발언자인지 여부 (서버에서 결정되거나 초기화)

// 예시 참여자 데이터
const Participants = ref([
  { name: "이예지", order: 1, currentPieces: 0 },
  { name: "김루리", order: 2, currentPieces: 1 },
  { name: "박성호", order: 3, currentPieces: 2 },
  { name: "이윤호", order: 4, currentPieces: 3 },
]);


// GameRoundOneView에서 전달받은 이벤트로 라운드 변경
const startNextRound = () => {
  currentRound.value = 2;
};


// // 참여자 순서 정렬 로직 (스마트폰 이용시간 기준)
// const reorderParticipants = () => {
//   Participants.value.sort((a, b) => a.usageTime - b.usageTime || b.currentPieces - a.currentPieces);
//   Participants.value.forEach((participant, index) => {
//     participant.order = index + 1;
//   });
// };
//
// // 라운드 1 종료 후 다음 라운드로 전환
// const startNextRound = (usageTimes) => {
//   // Round 1에서 입력받은 스마트폰 이용시간 업데이트
//   Participants.value.forEach((participant, index) => {
//     participant.usageTime = usageTimes[index];
//   });
//
//   reorderParticipants(); // 순서 정렬
//   currentRound.value = 2;
//
//   // 현재 사용자 발언자인지 여부 설정
//   isSpeaker.value = Participants.value[0].name === "박성호"; // 첫 번째 발언자가 "박성호"인지 확인 (예시)
// };

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
    />
    <!-- 듣는 이 화면 -->
    <ListenerView
      v-if="currentRound ===2 && !isSpeaker"
      :participants="Participants"
    />
</IonPage>
</template>

<style scoped>
.ion-page {
background-image: url('../../../assets/img/typetest/bg-type-test-page.png'); /* 이미지를 직접 넣는 방법 */
}
</style>