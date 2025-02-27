<script setup lang="ts">
import {
  IonContent,
  modalController, toastController, useIonRouter
} from "@ionic/vue";
import PuzzleProgressChip from "@/components/game/PuzzleProgressChip.vue";
import BaseButtonFooter from "@/components/common/BaseButtonFooter.vue";
import {computed, inject, onMounted, onUnmounted, PropType, ref, watch} from "vue";
import PlayerProfile from "@/components/game/multiplayer/PlayerProfile.vue";
import ChatBubbleWithBorder from "@/components/common/ChatBubbleWithBorder.vue";
import ReVoteDetails from "@/components/game/multiplayer/ReVoteDetails.vue";
import VotingResult from "@/components/game/multiplayer/VotingResult.vue";
import PuzzleSuccessModal from "@/components/game/PuzzleSuccessModal.vue";
import {enterAnimation, leaveAnimation} from "@/utils/puzzleModalAnimations";
import PuzzleFailureModal from "@/components/game/PuzzleFailureModal.vue";
import {GameState} from "@/types/GameState";
import {Player, RankingPlayer} from "@/types/Player";
import {VoteResult} from "@/types/VoteResult";
import {RoomStatus, useGameStore} from "@/store/gameStore";
import {useEventSourceStore} from "@/store/eventSourceStore";

const props = defineProps<{
  gameState: GameState;
  currentSpeaker: Player;
}>();

// emit을 선언
const emit = defineEmits<{
  (e: "nextTurn", nextSpeakerId: number): void;
}>();

// 타이머 ID 저장 변수
let timeoutId: ReturnType<typeof  setTimeout> | null = null;

const router = useIonRouter();
const roomId = props.gameState.roomId;
const gameStore = useGameStore();
const roomStatus = computed(() => gameStore.roomStatus);

/**
 * 상위 컴포넌트 상태 변수
 */
const players = computed(() => props.gameState.players);
const currentPieces = computed(() => props.gameState.currentPuzzlePieces);
const maxPieces = computed(() => props.gameState.totalPuzzlePieces);
const totalPlayers = computed(() => props.gameState.totalPlayers);
const currentSpeakerName = computed(() => props.currentSpeaker.playerInfo.name);

// 현재 상태 관리
const currentPhase = ref("voting"); // "voting", "result", reVoting
const voteResult = inject("voteResult", ref<VoteResult | null>(null));

// 투표 데이터
const agreeCount = ref(0);
const disagreeCount = ref(0);
const disagreePlayers = ref<string[]>([]); // 비동의한 사용자 배열
const isFooterVisible = ref(true); // 버튼 표시 여부
const currentMessage = ref("이야기를 들은 생각은 어떠신가요?<br> 연관성이 높게 잘 말하셨나요?");
const buttonText = ref("투표 진행중"); // 버튼 텍스트 초기값

/**
 * 메시지를 동적으로 반환하는 computed 속성
 */
const chatBubbleMessages = computed(() => {
  if (totalPlayers.value === 4) {
    return {
      resultAgree: `과반수 이상 동의로 '${currentSpeakerName.value}'가<br> 퍼즐 조각을 획득하였어요!`,
      resultDisagree: `'${currentSpeakerName.value}'의 이야기를 듣고,<br> 과반수 이상이 비동의에 투표했어요.`,
      reVoting: "비동의를 누른 이유가 무엇일까요?<br> 다같이 이야기하는 시간을 가져보고 <br> 다시 한번 투표해주세요",
      reVoteResultAgree: `재투표 결과, 과반수 이상 동의로 '${currentSpeakerName.value}'가 퍼즐 조각을 획득하셨어요!`,
      reVoteResultDisagree: `재투표 결과, 과반수 이상 비동의로 '${currentSpeakerName.value}'가 퍼즐 조각 획득을 실패하였어요!`,
    };
  } else if (totalPlayers.value === 3) {
    return {
      resultAgree: `'${currentSpeakerName.value}'가 동의를 받으셨기 때문에 퍼즐 조각을 획득하셨어요!`,
      resultDisagree: `'${currentSpeakerName.value}'의 이야기를 듣고,<br> 비동의가 더 많았어요.`,
      reVoting: "비동의를 누른 이유가 무엇일까요?<br> 다시 이야기하는 시간을 가져봐요.",
      reVoteResultAgree: `재투표 결과, '${currentSpeakerName.value}'가 동의를 받아 퍼즐 조각을 획득하셨어요!`,
      reVoteResultDisagree: `재투표 결과, '${currentSpeakerName.value}'가 퍼즐 조각 획득에 실패하셨어요.`,
    };
  } else {
    // 기본 메시지 반환
    return {
      resultAgree: `'${currentSpeakerName.value}'가 퍼즐 조각을 획득하셨어요!`,
      resultDisagree: `'${currentSpeakerName.value}'의 이야기를 듣고,<br> 투표 결과 퍼즐 조각 획득에 실패하셨어요.`,
      reVoting: "투표 결과에 대한 추가 논의가 필요합니다.",
      reVoteResultAgree: `재투표 결과, '${currentSpeakerName.value}'가 퍼즐 조각을 획득하셨어요!`,
      reVoteResultDisagree: `재투표 결과, '${currentSpeakerName.value}'가 퍼즐 조각 획득에 실패하셨어요.`,
    };
  }
});
/**
 * voteResult에 따른 watch 함수
 */
watch(voteResult, (newResult) => {
  if(!newResult) return;

  switch(newResult.type){

    // 퍼즐 조각을 획득했을 때,
    case "puzzle-acquired": {
      currentPhase.value = "result";
      agreeCount.value = newResult.agreeCount;
      disagreeCount.value = newResult.disagreeCount;
      const nextSpeakerId = newResult.nextSpeakerId;
      isFooterVisible.value = false;

      currentMessage.value = newResult.hasReVoted
        ? chatBubbleMessages.value.reVoteResultAgree // 재투표 성공 메세지
        : chatBubbleMessages.value.resultAgree; // 초기 투표 성공 메시지
      if (nextSpeakerId != undefined){
        // 3초 후 퍼즐 획득 모달 띄움
        timeoutId = setTimeout(() => {
          openSuccessModal(undefined, () => {
            emit("nextTurn", nextSpeakerId);
          });
        }, 3000);
      }
      break;
    }

    // "re-vote"를 받았을 때 처리
    case "re-vote": {
      currentPhase.value = "result";
      agreeCount.value = newResult.agreeCount;
      disagreeCount.value = newResult.disagreeCount;
      currentMessage.value = chatBubbleMessages.value.resultDisagree;
      isFooterVisible.value = false;

      // 처음 투표 결과 보여준 후 재투표 메시지 보여줌
      timeoutId = setTimeout(() => {
        currentPhase.value = "reVoting";
        disagreePlayers.value = newResult.disagreePlayers; // 비동의한 인원 업데이트
        currentMessage.value = chatBubbleMessages.value.reVoting;
        isFooterVisible.value = true;
        buttonText.value = "재투표 진행중";
      }, 4000);
      break;
    }

    // 퍼즐 조각 획득을 실패했을떄
    case "puzzle-failed": {
      currentPhase.value = "result";
      agreeCount.value = newResult.agreeCount;
      disagreeCount.value = newResult.disagreeCount;
      const nextSpeakerId = newResult.nextSpeakerId;
      isFooterVisible.value = false;

      currentMessage.value = chatBubbleMessages.value.reVoteResultDisagree;

      // 일정 시간 이후 퍼즐조각 획득 실패 모달 띄움
      if(nextSpeakerId != undefined) {
        timeoutId = setTimeout(() => {
          openFailureModal(() => {
            emit("nextTurn", nextSpeakerId);
          });
        }, 3000);
      }
      break;
    }

    // 퍼즐 조각을 다 모으고 게임을 완료할 떄,
    case "game-completed": {
      currentPhase.value = "completed"; // 게임 완료 상태
      agreeCount.value = newResult.agreeCount; // 찬성 수
      disagreeCount.value = newResult.disagreeCount; // 반대 수
      currentMessage.value = newResult.hasReVoted
        ? chatBubbleMessages.value.reVoteResultAgree // 재투표 성공 메세지
        : chatBubbleMessages.value.resultAgree; // 초기 투표 성공 메시지
      isFooterVisible.value = false;

      const rankingData = newResult.rankingData;

      // 3초 이후 퍼즐 획득 모달 띄움
      timeoutId = setTimeout(() => {
        openSuccessModal(rankingData);
      }, 3000);
      break;
    }
  }
})

/**
 * 퍼즐 획득 성공 모달 오픈 함수
 * @param rankingData - 게임 완료 시 필요한 랭킹 데이터
 * @param onConfirm - 모달에서 '확인' 버튼을 눌렀을 때 실행할 콜백 함수
 */
const openSuccessModal = async (
  rankingData?: Array<RankingPlayer>,
  onConfirm?: () => void,
) => {
  const modal = await modalController.create({
    component: PuzzleSuccessModal,
    cssClass: 'chat-bubble-modal',
    enterAnimation: enterAnimation,
    leaveAnimation: leaveAnimation,
    componentProps: {
      maxPieces: maxPieces.value,
    }
  });

  await modal.present();
  const toastMessage = currentPhase.value === "completed" ? "퍼즐 완성! 결과 화면으로 이동합니다." : "다음 차례로 넘어갑니다."
  await presentToast(toastMessage);


  // 모달 닫기와 상관 없이 3초후 다음 액션 실행
  setTimeout(() => {
    if (currentPieces.value >= maxPieces.value && rankingData) {
      gameStore.roomStatus = RoomStatus.ENDED;
      modal.dismiss();
      goPuzzleCompletion(rankingData);
    }
    if (onConfirm) {
      modal.dismiss();
      onConfirm();
    }
  }, 6000);

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
  await presentToast("다음 차례로 넘어갑니다.")

  // 모달 닫기와 상관 없이 3초후 다음 액션 실행
  setTimeout(() => {
    console.log("모달 표시시간이 종료 되었습니다. 다음 액션 실행");;
    if (onConfirm) {
      modal.dismiss();
      onConfirm();
    }
  }, 6000);
};

/**
 * 다음 액션을 알리는 토스트
 */
const presentToast = async (message: string) => {
  const toast = await toastController.create({
    message: message,
    cssClass: "top-toast toast-txt-center",
    duration: 3000,
    position: "top",
    positionAnchor:"backButtonHeader"
  });

  await toast.present();
}

/**
 * 퍼즐 완료 후 랭킹 화면으로 이동
 */
const goPuzzleCompletion = (rankingData: Array<RankingPlayer>) => {
  router.replace({
    path: "/puzzlecompletion",
    query: {
      rankingData: JSON.stringify(rankingData),
      mode: "multi",
      roomId: roomId,
    }
  })
}

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
      :class="{
        'no-footer': !isFooterVisible
      }"
    >

      <!-- 참여자 프로필 -->
      <div class="player-profiles">
        <PlayerProfile
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
          v-if="currentPhase === 'result' || currentPhase === 'completed'"
          :agree-counts="agreeCount"
          :disagree-counts="disagreeCount"
        />

        <ReVoteDetails
          v-if="currentPhase === 'reVoting'"
          :disagree-counts="disagreeCount"
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
  transition: margin-top 0.5s ease-in-out, min-height 0.5s ease-in-out; /* 모든 변화를 애니메이션 처리 */
}

.no-footer {
  min-height: 70vh;
}

.re-voting {
  min-height: 60vh; /* 재투표 상태에서는 원래 높이로 복귀 */
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