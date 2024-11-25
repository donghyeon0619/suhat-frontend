<script setup lang="ts">
import {IonContent, modalController, IonLabel, IonButton, toastController } from "@ionic/vue";
import PuzzleProgressChip from "@/components/game/PuzzleProgressChip.vue";
import BaseButtonFooter from "@/components/common/BaseButtonFooter.vue";
import {PropType, ref} from "vue";
import PlayerProfile from "@/components/game/multiplayer/PlayerProfile.vue";
import ChatBubbleWithBorder from "@/components/common/ChatBubbleWithBorder.vue";
import TimeInputModal from "@/components/game/multiplayer/TimeInputModal.vue";
import GameCardBg from "@/assets/img/game/bg-game-card.svg";

// 상위 컴포넌트로 보낼 이벤트 정의
const emit = defineEmits(["nextRound"]);

const currentPieces = ref(0)
const maxPieces = ref(10)
const usageTime = ref(0);
const orderSelected = ref(false);
const buttonText = ref("확인했어요"); // 버튼 텍스트 초기값

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
    console.log(data, "111")
    await presentToast();
    buttonText.value = "2라운드 시작" // 버튼 텍스트 변경
    orderSelected.value = true;
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
        v-for="participant in participants"
        :key="participant.name"
        :player-name="participant.name"
        :player-order="participant.order"
        :piece-count="participant.currentPieces"
        class="player-profile"
        :class="{
            'left-top-profile': participant.order === 1,
            'right-top-profile': participant.order === 2,
            'left-bottom-profile': participant.order === 3,
            'right-bottom-profile': participant.order === 4
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
          <div class="text-card">
            <img :src="GameCardBg" alt="Background" class="card-background" />
            <IonLabel class="card-text">그림카드</IonLabel>
          </div>
          <div class="face-card">
            <img :src="GameCardBg" alt="Background" class="card-background" />
            <IonLabel class="card-text">글자카드</IonLabel>
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
  padding-left: 5vw;
}

.face-card{
  padding-right: 5vw;

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