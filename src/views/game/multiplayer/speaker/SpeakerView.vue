<script setup lang="ts">
import SpeakerSpeakingView from "@/views/game/multiplayer/speaker/SpeakerSpeakingView.vue";
import SpeakerVotingView from "@/views/game/multiplayer/speaker/SpeakerVotingView.vue";
import {PropType, ref} from "vue";

const props = defineProps({
    participants: {type: Array as PropType<
        Array<{
          name: string;
          order: number;
          currentPieces: number;
        }>
      >,
      required: true,
    },
  }
);

const emit = defineEmits<{
  (e: "nextTurn", nextSpeakerId: number, myRole: "speaker" | "listener"): void;
}>()

const speaker = ref("이예지")
const currentPhase = ref("speaking");


/**
 * 하위 컴포넌트에서 emit으로 이벤트 "nextTurn" 발생 시 currentPhase listening으로 초기화
 * @param nextSpeakerId
 * @param myRole
 */
const handleNextTurn = (nextSpeakerId: number, myRole: "speaker" | "listener") => {
  currentPhase.value = currentPhase.value === "voting" ? "listening" : "voting";
  emit("nextTurn", nextSpeakerId, myRole);
}

/**
 * 하위 컴포넌트에서 emit으로 이벤트 "next-phase) 발생 시 listening 완료 후
 * voting으로 화면 전환 함수
 */
const nextPhase = () => {
  currentPhase.value = currentPhase.value === "speaking" ? "voting" : "speaking";
};

</script>

<template>
  <SpeakerSpeakingView
    v-if="currentPhase === 'speaking'"
    :current-speaker="speaker"
    @next-phase="nextPhase"
  />
  <SpeakerVotingView
    v-if="currentPhase === 'voting'"
    :current-speaker="speaker"
    :participants="participants"
    @next-turn ="handleNextTurn"
  />
</template>

<style scoped>

</style>