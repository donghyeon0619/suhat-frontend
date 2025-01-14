<script setup lang="ts">
import SpeakerSpeakingView from "@/views/game/multiplayer/speaker/SpeakerSpeakingView.vue";
import SpeakerVotingView from "@/views/game/multiplayer/speaker/SpeakerVotingView.vue";
import {computed, PropType, ref} from "vue";
import {GameState} from "@/types/GameState";

const props = defineProps<{
  gameState: GameState;
  currentPhase: string;

}>()

const currentPhase = computed(() => props.currentPhase);

const emit = defineEmits<{
  (e: "nextTurn", nextSpeakerId: number, myRole: "speaker" | "listener"): void;
}>()

/**
 * speaking이 true인 사람의 정보를 computed로 가져옴
 */
const currentSpeaker = computed(() => {
  return props.gameState.players.find(player => player.isSpeaking) || null;
})

</script>

<template>
  <SpeakerSpeakingView
    v-if="currentPhase === 'speaking'"
    :current-speaker="currentSpeaker?.playerInfo.name || '이름없음'"
  />
  <SpeakerVotingView
    v-if="currentPhase === 'voting'"
    :current-speaker="currentSpeaker?.playerInfo.name || '이름없음'"
    :game-state="props.gameState"
  />
</template>

<style scoped>

</style>