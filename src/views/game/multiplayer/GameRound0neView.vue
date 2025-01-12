<script setup lang="ts">
import {IonContent, modalController, IonLabel, toastController } from "@ionic/vue";
import PuzzleProgressChip from "@/components/game/PuzzleProgressChip.vue";
import BaseButtonFooter from "@/components/common/BaseButtonFooter.vue";
import {computed, PropType, ref} from "vue";
import PlayerProfile from "@/components/game/multiplayer/PlayerProfile.vue";
import ChatBubbleWithBorder from "@/components/common/ChatBubbleWithBorder.vue";
import TimeInputModal from "@/components/game/multiplayer/TimeInputModal.vue";
import GameCardBg from "@/assets/img/game/bg-game-card.svg";
import {GameState} from "@/types/GameState";
import {post} from "@/api/httpService";

// 상위 컴포넌트로 보낼 이벤트 정의
const emit = defineEmits(["nextRound"]);

const props = defineProps<{
  gameState: GameState
}>();

const currentPieces = computed(() => props.gameState.currentPuzzlePieces);
const maxPieces = computed(() => props.gameState.totalPuzzlePieces);
const totalPlayers = computed(() => props.gameState.totalPlayers);

const usageTime = ref(0);
const orderSelected = ref(false);
const buttonText = ref("확인했어요"); // 버튼 텍스트 초기값
const orderShow = ref(false);

const players = computed(() => props.gameState.players);

const openTimeInputModal = async () => {
  console.log('Opening TimeInputModal...');
  const modal = await modalController.create({
    component: TimeInputModal,
    cssClass: 'time-input-modal',
    initialBreakpoint: 1,
    breakpoints:[0,1],
    handle: false
  });

  await modal.present();
  console.log('TimeInputModal presented.');

  const { data, role } = await modal.onWillDismiss();
  console.log('TimeInputModal dismissed. Role:', role, 'Data:', data);

  if (role === 'confirm'){
    usageTime.value = data;
    try {
      const roomId = props.gameState.roomId
      const response = await post(`/api/game/${roomId}/round/1/usage-time`, {
        usageTime: data // 서버에 보낼 데이터
      });
      console.log("사용시간 입력", response);
      await presentToast();
      buttonText.value = "2라운드 시작" // 버튼 텍스트 변경
      orderSelected.value = true;
    } catch (error){
      console.error("사용시간 입력 요청 중 오류 발생", error);
    }
  }
};

const presentToast = async () => {
  const toast = await toastController.create({
    message: '이용습관이 적고, 앞서 했던 이용습관지 점수가 높은 순서대로 게임 순서가 결정되었어요.',
    cssClass: "top-toast",
    duration: 1500,
    position: "top",
    positionAnchor:"backButtonHeader"
  });

  await toast.present();
}

// 다음 라운드를 처리하는 함수
const handleNextRound = async () => {
  if (buttonText.value === "2라운드 시작"){
    console.log("start round2...");

    // 상위 컴포넌트로 nextRound 이벤트를 emit하여 라운드를 업데이트
    emit("nextRound");
  } else{
    await openTimeInputModal();
  }
}

</script>

<template>
  <IonContent scroll-y="false" class="ion-padding" >
    <!-- 퍼즐 현황 갯수 부분 -->
    <div class="puzzle-progress-section" >
      <PuzzleProgressChip :currentPieces="currentPieces" :totalPieces="maxPieces"/>
    </div>

    <!-- 게임 영역 -->
    <div class="game-play-section">
      <PlayerProfile
        :order-show="orderShow"
        v-for="(player, index) in players"
        :key="player.playerId"
        :player-name="player.playerInfo.name"
        :player-order="player.sequenceNumber"
        :piece-count="player.collectedPuzzlePieces"
        class="player-profile"
        :class="{
          'center-top-profile': totalPlayers === 3 && index === 0, // 3명일 때 중앙
          'left-bottom-profile': (totalPlayers === 3 && index === 1) || (totalPlayers === 4 && index === 2), // 3명 또는 4명일 때 왼쪽 아래
          'right-bottom-profile': (totalPlayers === 3 && index === 2) || (totalPlayers === 4 && index === 3), // 3명 또는 4명일 때 오른쪽 아래
          'left-top-profile': totalPlayers === 4 && index === 0, // 4명일 때 왼쪽 위
          'right-top-profile': totalPlayers === 4 && index === 1, // 4명일 때 오른쪽 위
         }"
      />
      <div class="chat-bubble-wrapper">
        <ChatBubbleWithBorder v-if="!orderSelected"
          message="퍼즐을 완성시키세요!
          <br>퍼즐 조각을 가장 많이 획득하여 퍼즐을 완성시킨 사람이 승자에요"
          :hasTail="false"
        />
        <ChatBubbleWithBorder
          v-if="orderSelected"
          message="주어진 그림과 글자 카드의 연관성에 대해 시간 내에 설명해주세요"
          :has-tail="false"
          :show-chip="false"
        />
        <div class="card-container" v-if="orderSelected">
          <div class="face-card">
            <img :src="GameCardBg" alt="Background" class="card-background" />
            <IonLabel class="card-text">글자카드</IonLabel>
          </div>
          <div class="text-card">
            <img :src="GameCardBg" alt="Background" class="card-background" />
            <IonLabel class="card-text">그림카드</IonLabel>
          </div>
        </div>
      </div>
    </div>
  </IonContent>
  <BaseButtonFooter :button-text="buttonText" @buttonClick="handleNextRound" />
</template>

<style scoped>
ion-content::part(background) {
  background: transparent;
}
.puzzle-progress-section{
  display: flex;
  align-items: center;
  justify-content: center;
}

.game-play-section{
  margin-top: 5vh;
  position: relative;
  height: 60vh;
  width: 100%;
}

/* Player Profile Positions */
.player-profile {
  position: absolute;
}

.center-top-profile {
  left: 50%;
  transform: translateX(-50%);
}

.left-top-profile {
  left: 2%;
}

.right-top-profile {
  right: 2%;
}

.left-bottom-profile {
  bottom: -5%;
  left: 2%;
}

.right-bottom-profile {
  bottom: -5%;
  right: 2%;
}

.chat-bubble-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%; /* Adjust width if necessary */
}

.card-container {
  display: flex;
  justify-content: center;
  margin-top: 5%;
}

.text-card,
.face-card {
  position: relative;
  width:50%;
  min-height: 40vw;
  display: flex;
  align-items: center;
  justify-content: center;
}
.text-card{
  padding-right: 5vw;
}

.face-card{
  padding-left: 5vw;

}

.card-background {
  position: absolute;
  top: 0;
  width: 70%;
  height: 100%;
  z-index: 1;
}

.card-text {
  text-align: center;
  padding: 1.5vh;
  z-index: 2;
  font-weight: 700;
  font-size: 1.125rem;
  line-height: 1.5;
  color: #ffffff;
}

</style>