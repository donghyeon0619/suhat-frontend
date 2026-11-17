<script setup lang="ts">
import {computed} from "vue";
import ListenerListeningView from "@/views/game/multiplayer/listener/ListenerListeningView.vue";
import ListenerVotingView from "@/views/game/multiplayer/listener/ListenerVotingView.vue";
import {GamePhase, GameState} from "@/types/GameState";

const props = defineProps<{
  gameState: GameState;
}>()

const currentPhase = computed(() => props.gameState.currentPhase);

const emit = defineEmits<{
  (e: "nextTurn", nextSpeakerId: number): void;
}>()

/**
 * speaking이 true인 사람의 정보를 computed로 가져옴
 */
const currentSpeaker = computed(() => {
  return props.gameState.players.find(player => player.speaking) || null;
})

const handleNextTurn = (nextSpeakerId: number) => {
  emit("nextTurn", nextSpeakerId);
}
</script>

<template>
  <ListenerListeningView
    v-if="currentPhase === GamePhase.DISCUSSION && currentSpeaker"
    :current-speaker="currentSpeaker"
  />
  <ListenerVotingView :key="props.gameState.votingEndsAt"
    v-if="currentPhase === GamePhase.VOTING && currentSpeaker"
    :current-speaker="currentSpeaker"
    :game-state="props.gameState"
    @next-turn="handleNextTurn"
  />
</template>

<style scoped>

</style>
