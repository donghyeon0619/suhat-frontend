<script setup lang="ts">
import {PropType, ref} from "vue";
import ListenerListeningView from "@/views/game/multiplayer/listener/ListenerListeningView.vue";
import ListenerVotingView from "@/views/game/multiplayer/listener/ListenerVotingView.vue";
const currentPhase = ref("listening");

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
  currentPhase.value = currentPhase.value === "listening" ? "voting" : "listening";
};

</script>

<template>
  <ListenerListeningView
    v-if="currentPhase === 'listening'"
    :current-speaker="speaker"
    @nextPhase="nextPhase"
  />
  <ListenerVotingView
    v-if="currentPhase === 'voting'"
    :current-speaker="speaker"
    :participants="participants"
  />
</template>

<style scoped>

</style>