<script setup lang="ts">
import {IonAvatar, IonChip, IonCol, IonContent, IonLabel, IonRow, toastController,} from "@ionic/vue";
import {inject, onBeforeUnmount, Ref, ref, watch} from "vue";
import MikeIcon from "@/assets/icons/game/icon-mike.svg"
import GameCardBg from "@/assets/img/game/bg-game-card.svg";
import {AssignedCard, Card} from "@/types/Card";
import {smartphoneTexts} from "@/data/smartphoneTexts";
import {smartphonePicture} from "@/data/smartphonePicture";
import {Player} from "@/types/Player";

// props 선언
const props = defineProps<{
  currentSpeaker: Player
}>()

// 타이머 샛업
const initialTime = 180 // 3분 선언
const timer = ref(initialTime); //타이머 3분에서 시작
const formattedTime = ref("3:00"); // "MM:SS"로 형식으로 화면에 보여줌
let timerInterval: ReturnType<typeof setInterval> | null = null;
const timerStartData = inject<Ref<{ startTime: number; } | null>>("timerStartData", ref(null));
const timeExtensionData = inject<Ref<{ additionalTime: number } | null>>("timeExtensionData", ref(null));

/**
 * 카드 관련 변수
 */
const cards = ref<Card[]>([
  { id: 1, isFlipped: false, type: 'text', content: ''},
  { id: 2, isFlipped: false, type: 'picture', content: ''},
])
const assignedCard = inject<Ref<AssignedCard | null>>("assignedCard", ref(null));


/**
 * 카드 부여 함수
 */
watch(
  () => assignedCard?.value, // sse 이벤트 데이터 감지
  (newCardData) => {
    if (newCardData) {
      console.log("새로운 카드 데이터 수신:", newCardData);

      // 카드 ID로 해당 카드 찾기
      const card = cards.value.find((c) => c.type === newCardData.cardType);
      if (card) {
        // 카드 데이터 업데이트
        card.isFlipped = true;
        card.type = newCardData.cardType;

        // 카드 타입에 따라 데이터 검색
        if (newCardData.cardType === "text") {
          const textData = smartphoneTexts.find((item) => item.id === newCardData.cardId);
          card.content = textData?.text || "데이터 없음";
        } else if (newCardData.cardType === "picture") {
          const pictureData = smartphonePicture.find((item) => item.id === newCardData.cardId);
          card.content = pictureData?.url || "데이터 없음";
        }
      } else {
        console.log(`ID(${newCardData.cardId})에 해당하는 카드를 찾을 수 없습니다.`);
      }
    }
  }
);

/**
 * 타이머 동기화 로직: 'timer-start' 이벤트를 수신했을 때 타이머 시작
 */
watch(
  () => timerStartData?.value,
  (newTimerData) => {
    if (newTimerData && newTimerData.startTime) {
      console.log("타이머 동기화 시작:", newTimerData);
      startTimer(newTimerData.startTime);
    }
  }
);

// "MM:SS" 로 바꾸는 함수
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

// 타이머 시작 함수
const startTimer = (serverStartTime: number) => {
  const clientCurrentTime = Date.now();
  const elapsedTime = Math.floor((clientCurrentTime - serverStartTime) / 1000);
  timer.value = initialTime - elapsedTime

  formattedTime.value = formatTime(timer.value);
  timerInterval = setInterval(() => {
    timer.value -= 1;
    formattedTime.value = formatTime(Math.max(timer.value, 0)); // 음수로 내려가지 않도록 보장

    if (timer.value <= 0) { // 타이머 종료 조건
      clearInterval(timerInterval!); // timerInterval이 null이 아님을 보장
      timerInterval = null; // 초기화
    }
  }, 1000);
};

/**
 * 시간 연장 이벤트 수신 시 타이머 업데이트
 */
watch(
  () => timeExtensionData?.value,
  (newExtensionData) => {
    if (newExtensionData && newExtensionData.additionalTime > 0) {
      timer.value += newExtensionData.additionalTime;
      formattedTime.value = formatTime(timer.value);
      presentToast();
    }
  }
);

/**
 * 시간 연장시 상단 토스트 출현
  */
const presentToast = async () => {
  const toast = await toastController.create({
    message: '남은 시간이 연장되었어요',
    cssClass: "top-toast toast-txt-center",
    duration: 1500,
    position: "top",
    positionAnchor:"backButtonHeader"
  });

  await toast.present();
}

// unmounted 될 때 타이머 멈춤
onBeforeUnmount(() => {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
  }
});

</script>
<template>
  <IonContent scroll-y="false" >
    <!-- 발화자 표시 영역 -->
    <div class="speaker-profile-section">
      <IonAvatar class="mike">
        <img :src="MikeIcon" alt="마이크">
      </IonAvatar>
      <IonChip class="player-chip">
        <IonLabel class="player-name">{{currentSpeaker.playerInfo.name}}</IonLabel>
      </IonChip>
    </div>

    <!-- 게임 카드 진행 영역 -->
    <div class="card-container ion-padding">
      <!-- 애니메이션 들어간 카드 -->
      <div
        v-for="card in cards"
        :key="card.id"
        class="card-wrapper"
        :class="{ flipped: card.isFlipped }"
      >
        <!-- 뒷면 (기본 상태) -->
        <div class="card-back">
          <img :src="GameCardBg" alt="Background" class="card-background" />
          <IonLabel class="card-text">
            {{ card.type === 'text' ? '글자 카드' : '그림 카드' }}
          </IonLabel>
        </div>

        <!-- 앞면 (뒤집힌 상태) -->
        <div
          v-if="card.type === 'text'"
          class="card-front text-card"
        >
          <img :src="GameCardBg" alt="Background" class="card-background" />
          <IonLabel
            class="card-text"
            v-html="card.content"
          >
          </IonLabel>
        </div>

        <div
          v-else
          class="card-front face-card"
        >
          <img :src="GameCardBg" alt="Background" class="card-background" />
          <img :src="card.content" class="card-picture" alt="그림 이미지" />
        </div>
      </div>
    </div>

  </IonContent>
  <IonRow class="card-footer ion-padding ">
    <div class="speech-bubble-wrapper">
      <div class="speech-bubble">
        <IonLabel>설명을 주의깊게 잘 들어주세요!</IonLabel>
      </div>
    </div>
    <IonCol class= "timer-display">
      <IonLabel class="timer-text">남은 시간 {{ formattedTime }}</IonLabel>
    </IonCol>
  </IonRow>
</template>

<style scoped>
ion-content::part(background) {
  background: transparent;
}
.speaker-profile-section{
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5%;
}

.mike{
  width: 10%;
  height: auto;
}
.player-chip{
  --background:#FFFFFF;
  --color: transparent;
  border: 2.4px solid #C7E399;
  border-radius: 12px;
  padding: 0.8vh 2.8vw;
  min-width: 20vw;
  justify-content: center;
}

.player-name{
  font-size: 1.125rem;
  line-height: 2;
  font-weight: Bold;
  color: black;
}

.card-container {
  display: flex;
  gap: 3.5vw;
  margin-top: 20%;

}

.text-card,
.face-card,
.card-back {
  position: relative;
  min-height: 60vw;
  margin: 0 1vh 0 1vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-wrapper{
  position: relative;
  width: 100%;
  height: 60vw;
  perspective: 1000px;
  cursor: pointer;
}

.card-wrapper .card-back,
.card-wrapper .card-front {
  position: absolute;
  top: 0;
  margin: auto;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transition: transform 0.65s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-wrapper .card-back {
  transform: rotateY(0deg);
  z-index: 2;
}

.card-wrapper .card-front {
  transform: rotateY(180deg);
  z-index: 1;
}

.card-wrapper.flipped .card-back {
  transform: rotateY(-180deg);
  z-index: 1;
}

.card-wrapper.flipped .card-front {
  transform: rotateY(0deg);
  z-index: 2;
}

.card-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.card-text, .card-picture {
  text-align: center;
  padding: 1.5vh;
  max-width: 90%;
  z-index: 2;
  color: #ffffff;
  font-weight: bold;
  font-size: 1.2rem;
  line-height: 1.5;
}



.speech-bubble-wrapper{
  position: absolute;
  top: -15%;
  left: 5%;
  width: 100%;
  background: transparent;
}

.speech-bubble{
  position: relative;
  background: #333D4B;
  border-radius: 12px;
  padding: 0.7vh 4vw;
  width: fit-content;
  align-items: center;
  ion-label{
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 2;
    color: white;
  }
}

/* 꼬리 만들기 - 기본적으로 활성화됨 */
.speech-bubble::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 15%;
  width: 0;
  height: 0;
  border: 15px solid transparent;
  border-top-color: #333D4B;
  border-bottom: 0;
  margin-left: -4vw;
  margin-bottom: -1.3vh;
}

.card-footer {
  position: relative;
}

.timer-display {
  background: #333D4B;
  border-radius: 16px;
  padding-top: 2vh;
  padding-bottom: 2vh;
  text-align: center;
  margin: 7% 1% 13% 1%;
}

.timer-text{
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.25rem;
  color: white;
}

/* Media Query for Small Devices (e.g., Galaxy S8) */
@media screen and (max-width: 360px) {
  .card-container{
    margin-top: 12%;
  }
}

/* Media Query for Foldable Devices (e.g., Galaxy Z Fold) */
@media  (max-width: 345px) {
  .card-container{
    margin-top: 17%;
  }
}


</style>