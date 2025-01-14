<script setup lang="ts">
import {computed, PropType, ref} from "vue";
import ListenerListeningView from "@/views/game/multiplayer/listener/ListenerListeningView.vue";
import ListenerVotingView from "@/views/game/multiplayer/listener/ListenerVotingView.vue";
import {GameState} from "@/types/GameState";

const props = defineProps<{
  gameState: GameState;
  currentPhase: string;
}>()

const emit = defineEmits<{
  (e: "nextTurn", nextSpeakerId: number, myRole: "speaker" | "listener"): void;
}>()


/**
 * speaking이 true인 사람의 정보를 computed로 가져옴
 */
const currentSpeaker = computed(() => {
  return props.gameState.players.find(player => player.isSpeaking) || null;
})


const currentPhase = computed(() => props.currentPhase);




</script>

<template>
  <ListenerListeningView
    v-if="currentPhase === 'listening'"
    :current-speaker="currentSpeaker?.playerInfo.name || '이름없음'"
  />
  <ListenerVotingView
    v-if="currentPhase === 'voting'"
    :current-speaker="currentSpeaker?.playerInfo.name || '이름없음'"
    :game-state="props.gameState"
  />
</template>

<style scoped>

</style>