<script setup lang="ts">
import {
  IonContent,
  modalController, useIonRouter
} from "@ionic/vue";
import PuzzleProgressChip from "@/components/game/PuzzleProgressChip.vue";
import BaseButtonFooter from "@/components/common/BaseButtonFooter.vue";
import {onMounted, onUnmounted, PropType, ref} from "vue";
import PlayerProfile from "@/components/game/multiplayer/PlayerProfile.vue";
import ChatBubbleWithBorder from "@/components/common/ChatBubbleWithBorder.vue";
import ReVoteDetails from "@/components/game/multiplayer/ReVoteDetails.vue";
import VotingResult from "@/components/game/multiplayer/VotingResult.vue";
import {useRoute} from "vue-router";
import PuzzleSuccessModal from "@/components/game/PuzzleSuccessModal.vue";
import {enterAnimation, leaveAnimation} from "@/utils/puzzleModalAnimations";
import PuzzleFailureModal from "@/components/game/PuzzleFailureModal.vue";
import {useEventSourceStore} from "@/store/eventSourceStore";

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
  currentSpeaker:{
      type : String,
    required: true
  }
  }
);



interface RankingPlayer {
  playerId: number; // 플레이어 ID
  playerName: string; // 플레이어 이름
  puzzlePieces: number; // 퍼즐 조각 개수
}

// 상위 컴포넌트로 보낼 이벤트 정의
const emit = defineEmits<{
  (e: "nextTurn", nextSpeakerId: number, myRole: "speaker" | "listener"): void;
}>();

// 타이머 ID 저장 변수
let timeoutId: ReturnType<typeof  setTimeout> | null = null;

// 라우트 관리
const route = useRoute();
const roomId = route.params.roomId;
const router = useIonRouter();

// 현재 상태 관리
const currentPhase = ref("voting"); // "voting", "result", reVoting
const currentResult = ref("");
const currentPieces = ref(0);
const maxPieces = ref(13);

// 투표 데이터
const agreeCounts = ref(2);
const disagreeCounts = ref(1);
const disagreePlayers = ref([]); // 비동의한 사용자 배열
const isFooterVisible = ref(true); // 버튼 표시 여부
const currentMessage = ref("게임이 아직 진행 중입니다.");
const buttonText = ref("투표 진행중"); // 버튼 텍스트 초기값

// SSE 관리
const eventSourceStore = useEventSourceStore();

// 메시지를 객체로 관리
const chatBubbleMessages = {
  voting: "이야기를 들은 생각은 어떠신가요?<br> 연관성이 높게 잘 말하셨나요?",
  resultAgree: `과반수 이상 동의로 '${props.currentSpeaker}'가<br> 퍼즐 조각을 획득하였어요!`,
  resultDisagree: `'${props.currentSpeaker}'의 이야기를 듣고,<br> 과반수 이상이 비동의에 투표했어요.`,
  reVoting: "비동의를 누른 이유가 무엇일까요?<br> 다같이 이야기하는 시간을 가져보고 <br> 다시 한번 투표해주세요",
  reVoteResultAgree: `재투표 결과, 과반수 이상 동의로 '${props.currentSpeaker}'가 퍼즐 조각을 획득하셨어요!`,
  reVoteResultDisagree: `재투표 결과, 과반수 이상 비동의로 '${props.currentSpeaker}'가 퍼즐 조각 획득을 실패하였어요!`,
};

/**
 * SSE 이벤트 핸들링 함수
 * @param event 이벤트 객체
 */
const handleSseEvent = (event: MessageEvent) => {
  const data = JSON.parse(event.data);
  switch(data.result){
    // "puzzle-acquired-next-turn" 이벤트를 받았을 때 처리
    case "puzzle-acquired-next-turn": {
      currentPhase.value = "result";
      currentResult.value = "agree";
      agreeCounts.value = data.agreeCounts;
      disagreeCounts.value = data.disagreeCounts;
      const nextSpeakerId = data.nextSpeakerId;
      const myNextRole = data.nextRole;

      currentMessage.value = data.hasReVoted
        ? chatBubbleMessages.reVoteResultDisagree // 재투표 성공 메시지
        : chatBubbleMessages.resultAgree // 초기 투표 성공 메시지

      // 3초 후 퍼즐 획득 모달 띄움
      timeoutId = setTimeout(() => {
        openSuccessModal(undefined,  () => {
          // 모달 확인 시 다음 턴으로 emit
          emit("nextTurn", nextSpeakerId, myNextRole as "speaker" | "listener")
        });
      }, 3000);
      break;
    }

    // "re-vote"를 받았을 때 처리
    case "re-vote": {
      currentPhase.value = "result";
      currentResult.value = "disagree";
      agreeCounts.value = data.agreeCounts;
      disagreeCounts.value = data.disagreeCounts;
      currentMessage.value = chatBubbleMessages.resultDisagree;

      timeoutId = setTimeout(() => {
        currentPhase.value = "reVoting";
        disagreePlayers.value = data.disagreePlayer; // 비동의한 인원 업데이트
        currentMessage.value = chatBubbleMessages.reVoting;
        isFooterVisible.value = true;
      }, 4000);
      break;
    }

    // "puzzle-failed-next-turn" 이벤트를 받았을 떄 처리
    case "puzzle-failed-next-turn": {
      currentPhase.value = "result";
      currentPhase.value = "disagree";
      agreeCounts. value = data.agreeCounts;
      disagreeCounts.value = data.disagreeCounts;
      const nextSpeakerId = data.nextSpeakerId;
      const myNextRole = data.nextRole;

      currentMessage.value = chatBubbleMessages.reVoteResultDisagree;

      // 일정 시간 이후 퍼즐조각 획득 실패 모달 띄움
      timeoutId = setTimeout(() => {
        openFailureModal(() => {
          // 모달 확인 시 다음 턴으로 emit
          emit("nextTurn", nextSpeakerId, myNextRole as "speaker" | "listener")
        });
      }, 3000);
      break;
    }

    // "game-completed" 이벤트를 받았을 때 처리
    case "game-completed": {
      currentPhase.value = "completed";
      currentResult.value = "agree";
      agreeCounts.value = data.agreeCounts;
      disagreeCounts.value = data.disagreeCounts;
      currentMessage.value = data.hasReVoted
        ? chatBubbleMessages.reVoteResultDisagree // 재투표 성공 메시지
        : chatBubbleMessages.resultAgree; // 초기 투표 성공 메시지

      const rankingData = data.rankingData;

      // 3초 이후 퍼즐 획득 모달 띄움
      timeoutId = setTimeout(() => {
        openSuccessModal(rankingData);
      }, 3000);
      break;
    }
  }
}

/**
 * 퍼즐 획득 성공 모달 오픈 함수
 * @param rankingData - 게임 완료 시 필요한 랭킹 데이터
 * @param onConfirm - 모달에서 '확인' 버튼을 눌렀을 때 실행할 콜백 함수
 */
const openSuccessModal = async (
  rankingData?: Array<RankingPlayer>,
  onConfirm?: () => void
) => {
  const modal = await modalController.create({
    component: PuzzleSuccessModal,
    cssClass: 'chat-bubble-modal',
    enterAnimation: enterAnimation,
    leaveAnimation: leaveAnimation,
  });
  await modal.present();

  const { role } = await modal.onDidDismiss();

  // 현재 퍼즐 갯수 증가
  if(role === 'confirm'){
    currentPieces.value++;
    // speakerPuzzlePieces.value++;
    // 퍼즐이 모두 모였을 경우 랭킹 화면으로 이동
    if (currentPieces.value >= maxPieces.value && rankingData) {
      goPuzzleCompletion(rankingData);
    }
    // 콜백함수가 있을 시 실행
    if(onConfirm) {
      onConfirm();
    }
  }
};

/**
 * 퍼즐 획득 실패 모달 오픈 함수
 * @param onConfirm - 모달에서 '확인' 버튼을 눌렀을 때 실행할 콜백 함수
 */
const openFailureModal = async (onConfirm?: () => void) => {
  const modal = await modalController.create({
    component: PuzzleFailureModal,
    cssClass: 'chat-bubble-modal',
  });

  await modal.present();
  const { role } = await modal.onDidDismiss();

  if(role === 'confirm') {
    if(onConfirm) {
      onConfirm();
    }
  }
};
/**
 * 퍼즐 완료 후 랭킹 화면으로 이동
 */
const goPuzzleCompletion = (rankingData: Array<RankingPlayer>) => {
  router.push({
    path: "/puzzlecompletion",
    query: {
      rankingData: JSON.stringify(rankingData),
      mode: "multi"
    }
  })
}

onMounted(() => {
  eventSourceStore.addEventListener("vote-result", handleSseEvent);
})

onUnmounted(() => {
  if(timeoutId) {
    clearTimeout(timeoutId);
  }
})
</script>

<template>
  <IonContent scroll-y="false" class="ion-padding" >
    <!-- 퍼즐 현황 갯수 부분 -->
    <div class="puzzle-progress-section" >
      <PuzzleProgressChip :currentPieces="currentPieces" :totalPieces="maxPieces"/>
    </div>

    <!-- 게임 영역 -->
    <div
      class="game-play-section"
      :class="{'no-footer': currentPhase === 'result'}">

      <!-- 참여자 프로필 -->
      <div class="player-profiles">
        <PlayerProfile
          v-for="participant in participants"
          :key="participant.name"
          :player-name="participant.name"
          :player-order="participant.order"
          :piece-count="participant.currentPieces"
          class="player-profile"
          :class="{
            // 참여자 수가 3명일 떄의 상단 프로필 위치
            'center-top-profile': participants.length === 3 && participant.order === 1,
            // 참여자 수가 4명일 떄의 상단 프로필 위치
            'left-top-profile': participants.length === 4 && participant.order === 1,
            'right-top-profile': participants.length === 4 && participant.order === 2,
            'left-bottom-profile': participant.order === 3,
            'right-bottom-profile': participant.order === 4
          }"
        />
      </div>

      <!-- 사용자 상호작용 영역 -->
      <div class="interactive-content">
        <!-- 상테에 따라 메시지 표시 -->
        <ChatBubbleWithBorder
          :message="currentMessage"
          :hasTail="false"
        />

        <!-- 상태에 따른 컴포넌트 렌더링 -->
        <VotingResult
          v-if="currentPhase === 'result'"
          :agree-counts="agreeCounts"
          :disagree-counts="disagreeCounts"
        />

        <ReVoteDetails
          v-if="currentPhase === 'reVoting'"
          :disagree-counts="disagreeCounts"
          :disagree-players="disagreePlayers"
        />
      </div>
    </div>
  </IonContent>
  <BaseButtonFooter
    v-if="isFooterVisible"
    :is-button-disabled="true"
    disabled-color="#C7E399"
    :button-text="buttonText"
  />
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
  min-height: 60vh; /* 최소 높이만 지정 */
  width: 100%;
  transition: margin-top 0.5s ease-in-out; /* 애니메이션 효과 추가 */
}

.no-footer{
  min-height: 70vh;
  transition: min-height 0.5s ease-in-out; /* 애니메이션 효과 추가 */
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

.interactive-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%; /* Adjust width if necessary */
}
</style>