<script setup lang="ts">
import {computed} from "vue";
import ListenerListeningView from "@/views/game/multiplayer/listener/ListenerListeningView.vue";
import ListenerVotingView from "@/views/game/multiplayer/listener/ListenerVotingView.vue";
import {GameState} from "@/types/GameState";

const props = defineProps<{
  gameState: GameState;
  currentPhase: string;
}>()

const emit = defineEmits<{
  (e: "nextTurn", nextSpeakerId: number): void;
}>()


/**
 * speaking이 true인 사람의 정보를 computed로 가져옴
 */
const currentSpeaker = computed(() => {
  return props.gameState.players.find(player => player.isSpeaking) || null;
})

const handleNextTurn = (nextSpeakerId: number) => {
  emit("nextTurn", nextSpeakerId);
}

const currentPhase = computed(() => props.currentPhase);

</script>

<template>
  <ListenerListeningView
    v-if="currentPhase === 'listening' && currentSpeaker"
    :current-speaker="currentSpeaker"
  />
  <ListenerVotingView
    v-if="currentPhase === 'voting' && currentSpeaker"
    :current-speaker="currentSpeaker"
    :game-state="props.gameState"
    @next-turn="handleNextTurn"
  />
</template>

<style scoped>

</style>