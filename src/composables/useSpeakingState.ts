import { computed, inject, onBeforeUnmount, ref, Ref } from 'vue';
import { GameState } from '@/types/GameState';
import { multiSmartphoneTexts } from '@/data/multiSmartphoneTexts';
import { multiSmartphonePicture } from '@/data/multiSmartphonePicture';
import { remainingSeconds } from '@/utils/gameRevision';

export function useSpeakingState() {
  const state = inject<Ref<GameState | null>>('gameSnapshot', ref(null));
  const offset = inject<Ref<number>>('serverOffset', ref(0));
  const now = ref(Date.now());
  const interval = setInterval(() => { now.value = Date.now(); }, 250);
  onBeforeUnmount(() => clearInterval(interval));
  const timer = computed(() => state.value?.speakingEndsAt
    ? remainingSeconds(state.value.speakingEndsAt, offset.value, now.value) : 180);
  const formattedTime = computed(() => `${Math.floor(timer.value / 60)}:${String(timer.value % 60).padStart(2, '0')}`);
  const cards = computed(() => [
    { id: 1, type: 'text', isFlipped: !!state.value?.assignedTextCardId,
      content: multiSmartphoneTexts.find(c => c.id === state.value?.assignedTextCardId)?.text ?? '' },
    { id: 2, type: 'picture', isFlipped: !!state.value?.assignedPictureCardId,
      content: multiSmartphonePicture.find(c => c.id === state.value?.assignedPictureCardId)?.url ?? '' },
  ]);
  return { state, timer, formattedTime, cards };
}
