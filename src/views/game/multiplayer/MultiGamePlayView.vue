<script setup lang="ts">
import { computed, provide, ref, shallowRef } from 'vue';
import { alertController, IonPage, onIonViewWillEnter, onIonViewWillLeave, useIonRouter } from '@ionic/vue';
import { onBeforeRouteLeave, useRoute } from 'vue-router';
import GameExitHeader from '@/components/game/GameExitHeader.vue';
import GameRound0neView from '@/views/game/multiplayer/GameRound0neView.vue';
import SpeakerView from '@/views/game/multiplayer/speaker/SpeakerView.vue';
import ListenerView from '@/views/game/multiplayer/listener/ListenerView.vue';
import { deleteRequest } from '@/api/httpService';
import { useEventSourceStore } from '@/store/eventSourceStore';
import { useUserStore } from '@/store/user';
import { RoomStatus, useGameStore } from '@/store/gameStore';
import { GameState } from '@/types/GameState';
import { remainingSeconds } from '@/utils/gameRevision';
import { gameHooks } from '@/globals/gameHooks';

const roomId = String(useRoute().params.roomId);
const router = useIonRouter();
const events = useEventSourceStore();
const user = useUserStore();
const game = useGameStore();
const state = shallowRef<GameState | null>(null);
const serverOffset = ref(0);
const now = ref(Date.now());
let clock: ReturnType<typeof setInterval> | undefined;
const votingSeconds = computed(() => remainingSeconds(state.value?.votingEndsAt ?? 0, serverOffset.value, now.value));
const leaving = ref(false);
const navigating = ref(false);
const isHost = computed(() => state.value?.hostId === user.userInfo.id);
const isSpeaker = computed(() => state.value?.players.some(p => p.playerId === user.userInfo.id && p.speaking));
const orderAssigned = computed(() => state.value?.players.every(p => p.sequenceNumber > 0) ?? false);
const turnKey = computed(() => `${state.value?.currentRound}:${state.value?.currentTurn}`);
provide('gameSnapshot', state);
provide('serverOffset', serverOffset);

function applyState(next: GameState) {
  if (next.roomId !== roomId || (state.value && next.revision <= state.value.revision)) return;
  serverOffset.value = next.serverTime - Date.now();
  state.value = next;
  game.roomStatus = next.roomStatus as RoomStatus;
  if (navigating.value) return;
  if (next.roomStatus === 'WAITING') {
    navigating.value = true;
    router.replace(`/game/waiting/${roomId}`);
  } else if (next.roomStatus === 'ENDED') {
    navigating.value = true;
    events.disconnectByUser();
    router.replace({ path: '/puzzlecompletion', query: {
      rankingData: encodeURIComponent(JSON.stringify(next.ranking)), mode: 'multi', roomId,
    } });
  }
}

const onState = (event: MessageEvent) => applyState(JSON.parse(event.data));
const onRemoved = () => {
  game.roomStatus = RoomStatus.CLOSED;
  navigating.value = true;
  events.disconnectByUser();
  router.replace('/game/home');
};
const pause = async () => { events.disconnectByUser(); };
const resume = async () => { if (!leaving.value) events.connect(roomId); };

onIonViewWillEnter(() => {
  navigating.value = false;
  leaving.value = false;
  clearInterval(clock);
  clock = setInterval(() => { now.value = Date.now(); }, 250);
  events.addEventListener('game-state', onState);
  events.addEventListener('not-in-room', onRemoved);
  gameHooks.onPauseHandler = pause;
  gameHooks.onResumeHandler = resume;
  if (events.latestState?.roomId === roomId && events.latestState.roomStatus !== 'WAITING') applyState(events.latestState);
  events.connect(roomId);
});

onIonViewWillLeave(() => {
  clearInterval(clock);
  events.removeEventListener('game-state', onState);
  events.removeEventListener('not-in-room', onRemoved);
  gameHooks.onPauseHandler = undefined;
  gameHooks.onResumeHandler = undefined;
});

onBeforeRouteLeave(async () => {
  if (navigating.value || leaving.value || game.roomStatus !== RoomStatus.IN_GAME) return true;
  const alert = await alertController.create({
    header: '방 나가기', message: '나가면 진행 중인 게임이 종료됩니다. 나가시겠습니까?',
    buttons: [{ text: '취소', role: 'cancel' }, { text: '나가기', role: 'confirm' }],
  });
  await alert.present();
  if ((await alert.onDidDismiss()).role !== 'confirm') return false;
  await deleteRequest(`rooms/${roomId}/players`);
  leaving.value = true;
  events.disconnectByUser();
  game.roomStatus = RoomStatus.CLOSED;
  return true;
});
</script>

<template>
  <IonPage>
    <GameExitHeader id="backButtonHeader" :header-title="`라운드 ${state?.currentRound ?? ''}`" @button-click="router.back()" />
    <div v-if="!events.isConnected" role="status" class="connection-status">연결을 복구하고 있습니다. 게임 시간은 계속 진행됩니다.</div>
    <template v-if="state">
      <div v-if="state.currentPhase === 'VOTING'" class="vote-summary">투표 마감까지 {{ votingSeconds }}초 · 미제출 시 기권</div>
      <div v-if="state.lastVoteResult?.result" class="vote-summary" role="status">
        최근 투표: 동의 {{ state.lastVoteResult.agreeCount }} · 비동의 {{ state.lastVoteResult.disagreeCount }} · 기권 {{ state.lastVoteResult.abstainCount }}
        <span v-if="state.reVoting"> — 재투표 중</span>
      </div>
      <GameRound0neView v-if="state.currentRound === 1" :game-state="state" :is-host="isHost" :order-assigned="orderAssigned" />
      <SpeakerView v-else-if="state.currentRound === 2 && isSpeaker" :key="turnKey" :game-state="state" />
      <ListenerView v-else-if="state.currentRound === 2" :key="turnKey" :game-state="state" />
    </template>
  </IonPage>
</template>

<style scoped>
.ion-page {
  background-image: url('../../../assets/img/typetest/bg-type-test-page.png'); /* 이미지를 직접 넣는 방법 */
}
.vote-summary { padding: 6px 16px; background: #eef4ff; z-index: 1; }
.connection-status { padding: 8px 16px; background: #fff3cd; color: #453b17; z-index: 1; }
</style>
