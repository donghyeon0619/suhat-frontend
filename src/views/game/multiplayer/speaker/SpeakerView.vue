<script setup lang="ts">
import SpeakerSpeakingView from "@/views/game/multiplayer/speaker/SpeakerSpeakingView.vue";
import SpeakerVotingView from "@/views/game/multiplayer/speaker/SpeakerVotingView.vue";
import {PropType, ref} from "vue";
const currentPhase = ref("speaking");

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

const speaker = ref("이예지")


// 단계 전환
const nextPhase = () => {
  currentPhase.value = currentPhase.value === "speaking" ? "voting" : "speaking";
};

</script>

<template>
  <SpeakerSpeakingView
    v-if="currentPhase === 'speaking'"
    :current-speaker="speaker"
    @nextPhase="nextPhase"
  />
  <SpeakerVotingView
    v-if="currentPhase === 'voting'"
    :current-speaker="speaker"
    :participants="participants"
  />
</template>

<style scoped>

</style>