<script setup lang="ts">
import {IonContent, IonLabel, IonButton, IonRow, IonCol,IonText, IonCard,IonCardContent, IonCardTitle, IonCardHeader } from "@ionic/vue";
import PuzzleProgressChip from "@/components/game/PuzzleProgressChip.vue";
import BaseButtonFooter from "@/components/common/BaseButtonFooter.vue";
import {computed, PropType, ref} from "vue";
import PlayerProfile from "@/components/game/multiplayer/PlayerProfile.vue";
import ChatBubbleWithBorder from "@/components/common/ChatBubbleWithBorder.vue";
import ReVoteDetails from "@/components/game/multiplayer/ReVoteDetails.vue";
import VotingResult from "@/components/game/multiplayer/VotingResult.vue";

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

// 상위 컴포넌트로 보낼 이벤트 정의
const emit = defineEmits(["nextRound"]);

// 현재 상태 관리
const currentPhase = ref("result"); // "voting", "reVoteResult", "result", reVoting
const currentPieces = ref(0);
const maxPieces = ref(13);

// 투표 데이터
const agreeCounts = ref(2);
const disagreeCounts = ref(1);
const disagreeUsers = ref([]); // 비동의한 사용자 배열
const isVotingComplete = ref(false);
const isReVoting = ref(false);
const buttonText = ref("투표 진행중"); // 버튼 텍스트 초기값

// 메시지를 객체로 관리
const chatBubbleMessages = {
  voting: "이야기를 들은 생각은 어떠신가요?<br> 연관성이 높게 잘 말하셨나요?",
  resultAgree: `과반수 이상 동의로 '${props.currentSpeaker}'가<br> 퍼즐 조각을 획득하였어요!`,
  resultDisagree: `'${props.currentSpeaker}'의 이야기를 듣고,<br> 과반수 이상이 비동의에 투표했어요.`,
  reVoting: "비동의를 누른 이유가 무엇일까요?<br> 다같이 이야기하는 시간을 가져보고 <br> 다시 한번 투표해주세요",
  reVoteResultAgree: `재투표 결과, 과반수 이상 동의로 '${props.currentSpeaker}'가 퍼즐 조각을 획득하셨어요!`,
  reVoteResultDisagree: `재투표 결과, 과반수 이상 비동의로 '${props.currentSpeaker}'가 퍼즐 조각 획득을 실패하였어요!`,
};
// 현재 메시지를 상태에 따라 가져오기
const currentMessage = computed(() => {
  if (currentPhase.value === "voting") {
    return chatBubbleMessages.voting;
  }
  if (currentPhase.value === "result") {
    return agreeCounts.value > disagreeCounts.value
      ? chatBubbleMessages.resultAgree
      : chatBubbleMessages.resultDisagree;
  }
  if(currentPhase.value === "reVoting"){
    return chatBubbleMessages.reVoting
  }
  if (currentPhase.value === "reVoteResult") {
    return agreeCounts.value > disagreeCounts.value
      ? chatBubbleMessages.reVoteResultAgree
      : chatBubbleMessages.reVoteResultDisagree;
  }
  return "게임이 아직 진행중입니다";
});

// 백엔드에서 투표 결과를 가져오는 함수
const fetchVotingResult = async () => {
  // 예시 데이터
  agreeCounts.value = 3;
  disagreeCounts.value = 1;
  disagreeUsers.value = ["이예지"]; // 비동의 사용자

  if (agreeCounts.value > disagreeCounts.value) {
    // 과반수 이상 동의
    currentPhase.value = "result";
    isVotingComplete.value = true;
    setTimeout(() => {
      emit("nextRound"); // 다음 라운드로 이동
    }, 1000);
  } else {
    // 과반수 이하 동의 (재투표 필요)
    currentPhase.value = "revote";
    isVotingComplete.value = false;
    isReVoting.value = true;
  }
};

// 재투표 결과 처리 함수
const fetchReVoteResult = async () => {
  agreeCounts.value = 2; // 예시 재투표 결과
  disagreeCounts.value = 2;

  if (agreeCounts.value > disagreeCounts.value) {
    // 재투표 결과 동의 과반수
    currentPhase.value = "result";
    isVotingComplete.value = true;
    setTimeout(() => {
      emit("nextRound"); // 다음 라운드로 이동
    }, 1000);
  } else {
    // 재투표 결과 비동의 과반수
    currentPhase.value = "result";
    isVotingComplete.value = true;
    setTimeout(() => {
      emit("nextRound"); // 다음 라운드로 이동
    }, 1000);
  }
};
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
      :class="{'no-footer': isVotingComplete || currentPhase === 'result' || currentPhase ==='reVoteResult' }">

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
          v-if="currentPhase === 'result' || currentPhase === 'reVoteResult'"
          :agreeCounts="agreeCounts"
          :disagreeCounts="disagreeCounts"
        />

        <ReVoteDetails
          v-if="currentPhase === 'reVoting'"
          :disagreeCounts="disagreeCounts"
          :disagree-users="disagreeUsers"
        />
      </div>
    </div>
  </IonContent>
  <BaseButtonFooter
    v-if="currentPhase !== 'result' && currentPhase !== 'reVoteResult'"
    :class="{ hidden: currentPhase === 'result' || currentPhase === 'reVoteResult' }"
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

/* 버튼 숨김 애니메이션 */
.base-button-footer {
  transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
  opacity: 1;
  transform: translateY(0);
}

.base-button-footer.hidden {
  opacity: 0;
  transform: translateY(100%);
}
</style>