<script setup lang="ts">
import {IonPage, onIonViewWillEnter} from "@ionic/vue";
import BackButtonHeader from "@/components/common/BackButtonHeader.vue";
import GameRound0neView from "@/views/game/multiplayer/GameRound0neView.vue";
import {reactive, ref} from "vue";
import SpeakerView from "@/views/game/multiplayer/speaker/SpeakerView.vue";
import ListenerView from "@/views/game/multiplayer/listener/ListenerView.vue";
import {useRoute} from "vue-router";
import {get} from "@/api/httpService";
import {useEventSourceStore} from "@/store/eventSourceStore";
import {GameState} from "@/types/GameState";
import {useUserStore} from "@/store/user";


// 라우트 파라미터
const route = useRoute();
const roomId = String(route.params.roomId);

// store 변수 선언
const eventSourceStore = useEventSourceStore();
const userStore = useUserStore();

const gameState = reactive<GameState>({
  roomId: roomId || '',
  roomName: '',
  hostId: 0,
  totalPlayers: 0,
  totalPuzzlePieces: 0,
  currentPuzzlePieces: 0,
  currentTurn: 0,
  currentRound: 1,
  players: [],

})

const isHost = ref(false); // 호스트인지 여부
const isSpeaker = ref(true); // 발언자인지 여부 (서버에서 결정되거나 초기화)

/**
 * 'player-left' 이벤트: 플레이어 제거
 * @param event
 */
const playerLeftHandler = (event: MessageEvent) => {
  console.log('player-left 이벤트 수신:', event.data);

};

const playerOrderAssignedHandler = (event: MessageEvent) => {

}

// GameRoundOneView에서 전달받은 이벤트로 라운드 변경v b
const startNextRound = () => {
  gameState.currentRound = 2;
};

const handleNextTurn = (nextSpeakerId: number, myRole: "speaker" | "listener") => {
  isSpeaker.value = myRole === "speaker";
}

onIonViewWillEnter(async () => {

  console.log("게임 시작되어 게임상태를 불러옵니다.")
  try {
    const response = await get(`games/${roomId}/state`);
    Object.assign(gameState, response); // 서버에서 가져온 데이터를 gamestate에 병합

    //호스트 여부 확인
    const currentUserId = userStore.userInfo.id; // pinia에서 userId 가져오기
    if (gameState.hostId === currentUserId) {
      isHost.value = true;
    }

    console.log("초기 게임 상태:", gameState);
  } catch (error) {
    console.error("게임 상태를 불러오는 중 오류 발생 ")
  }

  eventSourceStore.addEventListener("player-left", playerLeftHandler);
  eventSourceStore.addEventListener("player-order-assigned", playerOrderAssignedHandler);

})

</script>
<template>
  <IonPage>
    <BackButtonHeader id="backButtonHeader" :header-title="`라운드 ${gameState.currentRound}`" show-title="true"/>

    <!-- Round 1일 때 -->
    <GameRound0neView
      :game-state="gameState"
      v-if="gameState.currentRound === 1"
      @nextRound="startNextRound"
    />

    <!-- Round 2일 때 -->
    <!-- 말하는 이 화면 -->
    <SpeakerView
      v-if="gameState.currentRound === 2 && isSpeaker"
      :participants="players"
      @next-turn="handleNextTurn"
    />
    <!-- 듣는 이 화면 -->
    <ListenerView
      v-if="gameState.currentRound === 2 && !isSpeaker"
      :participants="players"
      @next-turn="handleNextTurn"
    />
</IonPage>
</template>

<style scoped>
.ion-page {
background-image: url('../../../assets/img/typetest/bg-type-test-page.png'); /* 이미지를 직접 넣는 방법 */
}
</style>