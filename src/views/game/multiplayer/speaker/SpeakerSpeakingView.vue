<script setup lang="ts">
import {
  IonContent,
  IonAvatar,
  IonChip,
  IonCard,
  IonCardContent,
  IonRow,
  IonCol,
  IonButton,
  IonLabel,
  IonIcon, IonThumbnail, modalController, toastController, alertController
} from "@ionic/vue";
import {inject, onBeforeUnmount, Ref, ref, watch} from "vue";
import MikeIcon from "@/assets/icons/game/icon-mike.svg"
import GameCardBg from "@/assets/img/game/bg-game-card.svg";
import {searchSharp} from "ionicons/icons";
import FlagIcon from "@/assets/icons/home/icon-flag.svg"
import TimerIcon from "@/components/game/multiplayer/TimerIcon.vue";
import ChatBubbleModal from "@/components/common/ChatBubbleModal.vue";
import HintModal from "@/components/game/multiplayer/HintModal.vue";
import {smartphoneTexts} from "@/data/smartphoneTexts";
import {post} from "@/api/httpService";
import {useRoute} from "vue-router";
import {AssignedCard, Card} from "@/types/Card";
import {smartphonePicture} from "@/data/smartphonePicture";
import {Player} from "@/types/Player";

// props 선언
const props = defineProps<{
  currentSpeaker: Player
}>()

const route = useRoute();
const roomId = route.params.roomId;

/**
 *  타이머 샛업
  */
const ADDITIONAL_TIME = 120
const initialTime = 180 // 3분 선언
const timer = ref(initialTime); //타이머 3분에서 시작
const formattedTime = ref("3:00"); // "MM:SS"로 형식으로 화면에 보여줌
let timerInterval: ReturnType<typeof setInterval> | null = null;
const timerStartData = inject<Ref<{ startTime: number; } | null>>("timerStartData", ref(null));
const timeExtensionData = inject<Ref<{ additionalTime: number } | null>>("timeExtensionData", ref(null));
// 시간 연장 유무
const hasExtended = ref(false);
const speakingStarted = ref(false);
const hasEnded = ref(false);

/**
 * 카드 관련 변수
 */
const cards = ref<Card[]>([
  { id: 1, isFlipped: false, type: 'text', content: ''},
  { id: 2, isFlipped: false, type: 'picture', content: ''},
])
const assignedCard = inject<Ref<AssignedCard | null>>("assignedCard", ref(null));

/**
 * 카드 클릭 시 호출되는 API 요청
 */
const sendCardClickRequest = async (id:number) => {
  // 클릭한 카드 찾기
  const card = cards.value.find((c) => c.id === id);
  if (!card || card.isFlipped) return; // 이미 뒤집힌 카드 무시

  // 카드 타입에 따라 데이터 길이 계산
  const cardType = card.type;
  const dataCount = cardType === "text" ? smartphoneTexts.length : smartphonePicture.length;

  try {
    const response = await post(`games/${roomId}/card/${cardType}?maxId=${dataCount}`);
    console.log("카드 요청:", response);
  } catch (error) {
    console.error("카드 부여 요청 중 오류 발생", error)
  }
}

/**
 * 카드 부여 watch 함수
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
 * 타이머  시작 로직: 'timer-start' 이벤트를 수신했을 때 타이머 시작
 */
watch(
  () => timerStartData?.value,
  (newTimerData) => {
    if (newTimerData && newTimerData.startTime) {
      console.log("타이머 시작:", newTimerData);
      speakingStarted.value = true;
      startTimer(newTimerData.startTime);
    }
  }
)

/**
 * "MM:SS" 로 바꾸는 함수
 * @param seconds
 */
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

/**
 * 타이머 시작 함수
 */
const startTimer = (serverStartTime: number) => {
  const clientCurrentTime = Date.now();
  const elapsedTime = Math.floor((clientCurrentTime - serverStartTime) / 1000);  // 초단위
  const remainingTime = initialTime - elapsedTime;

  if (remainingTime > 0) {
    timer.value = remainingTime
    formattedTime.value = formatTime(timer.value);

    // 이미 존재한다면 다시 클리어 하고 시작.
    if (timerInterval !== null) {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    timerInterval = setInterval(() => {
      if (timer.value > 0) {
        timer.value -= 1
        formattedTime.value = formatTime(timer.value);

        // 이 때 1분 남았는지 확인
        if (timer.value === 60) {
          const message = hasExtended.value
            ? "한 번 시도해보고, 잘 안 되면 다시 해봐도 괜찮아요. 중요한 건 시도하는 거예요!"
            : "천천히 생각해보고, 생각난 대로 말해보세요. 괜찮아요!";
          openCheerUpModal(message);
        }
      } else {
        handleEndSpeaking();
      }
    }, 1000);
  } else {
    // 시간이 이미 다 지났다면 다음 단계로 전환
    handleEndSpeaking();
  }
};

/**
 * 타이머 정지 함수
 */
const stopTimer = async () => {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  // 모든 열려 있는 모달 닫기
  await closeAllModals();
};

/**
 * "말하기 종료" 버튼 클릭 시 타이머 정지 및 다음 phase 전환 함수
 */
const handleEndSpeaking = async () => {

  if (hasEnded.value) return; // 이미 종료 처리되었으면 리턴

  if (!speakingStarted.value) {
    await presentAlert("말하기가 아직 시작되지 않았습니다. 먼저 그림카드, 글자카드를 뒤집어서 말하기를 시작 후 종료를 시도하세요.");
    return;
  }

  hasEnded.value = true;
  await stopTimer();
  try {
    const response = await post(`games/${roomId}/speaking/end`);
    console.log("말하기 종료", response);
  } catch (error) {
    console.error("말하기 종료 에러", error);
  }
};

/**
 * 시간 연장 이벤트 수신 시 타이머 업데이트
 */
watch(
  () => timeExtensionData?.value,
  (newExtensionData) => {
    if (newExtensionData && newExtensionData.additionalTime > 0 && !hasExtended.value) {
      timer.value += newExtensionData.additionalTime;
      formattedTime.value = formatTime(timer.value);
      hasExtended.value = true;
      presentToast();
    }
  }
)


/**
 * 시간 연장함수
 */
const extendTime = async () => {
  if(!speakingStarted.value) {
    await presentAlert("먼저 그림카드와 글자 카드를 눌러주세요.");
    return
  }

  if (!hasExtended.value) {
    try {
      const response = await post(`games/${roomId}/timer/extensions?additionalTime=${ADDITIONAL_TIME}`);
      console.log("시간 연장 요청 결과:", response)
      formattedTime.value = formatTime(timer.value);
      hasExtended.value = true;
    } catch (error) {
      console.error("시간 연장 실패 :", error);
    }
  }
}

/**
 * 시간 연장시 토스트 출현
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

/**
 * 응원 모달 오픈 함수
 * @param message
 */
const openCheerUpModal = async (message:string) => {
  const modal = await modalController.create({
    component: ChatBubbleModal,
    componentProps: { bubbleText: message},
    cssClass: 'chat-bubble-modal',
  });

  await modal.present();
  await modal.onDidDismiss();
};

/**
 * 힌트 모달 오픈
 */
const openHintModal = async () => {
  const modal = await modalController.create({
    component: HintModal,
    cssClass: 'hint-modal',
  });

  await modal.present();
  await modal.onDidDismiss();
};

/**
 * 모든 모달 삭제
 */
const closeAllModals = async () => {
  let activeModal = await modalController.getTop();
  while (activeModal) {
    await modalController.dismiss();
    activeModal = await modalController.getTop();
  }
};

/**
 * 오류 발생 시 경고창 뜸
 */
const presentAlert = async (message: string) => {
  const alert = await alertController.create({
    header: '잘못된 동작',
    message: message,
    buttons: [
      {
        text: '확인',
        role: 'confirm',
        cssClass: "my-custom-alert-button-class",
      },
    ],
    cssClass: "custom-one-button-alert"
  });
  await alert.present();
}

/**
 * unmounted 될 때 타이머 초기화
 */
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
        @click="sendCardClickRequest(card.id)"
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

    <!-- 하단 영역 -->
    <IonCard class="control-section ion-padding">

      <!-- 힌트보기 버튼 영역 -->
      <IonButton
        shape="round"
        class="hint-button"
        @click="openHintModal"
      >
        <ion-icon class="search-icon" slot="start" :icon="searchSharp" aria-hidden="true"></ion-icon>
      힌트 보기
      </IonButton>

      <!-- 하단 버튼 영역 -->
      <IonCardContent class="control-buttons">
          <IonRow>
            <IonCol>
              <IonButton
                :disabled="hasExtended"
                expand="block"
                class="control-button"
                :class="{ 'disabled-button': hasExtended }"
                @click="extendTime"
              >
                <div class="button-content">
                  <IonThumbnail style="--size:65%;">
                    <TimerIcon :fillColor="hasExtended ? '#A3A9B0' : '#5B8EF3'"/>
                  </IonThumbnail>
                  <IonLabel class="button-title">
                    시간연장
                  </IonLabel>
                </div>
              </IonButton>
            </IonCol>
            <IonCol >
              <IonButton
                expand="block"
                class="control-button"
                @click="handleEndSpeaking"
              >
                <div class="button-content">
                  <IonThumbnail style="--size:45%;">
                    <img :src="FlagIcon" alt="플래그 아이콘" class="flag-icon">
                  </IonThumbnail>
                  <IonLabel class="button-title">
                    말하기 종료
                  </IonLabel>
                </div>
              </IonButton>
            </IonCol>
          </IonRow>
      </IonCardContent>
      <IonRow class="card-footer">
        <IonCol class= "timer-display">
          <IonLabel class="timer-text">남은 시간 {{ formattedTime }}</IonLabel>
        </IonCol>
      </IonRow>
    </IonCard>
  </IonContent>
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
  margin-top: 12%;

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
  padding: 2vh;
  max-width: 90%;
  z-index: 2;
  color: #ffffff;
  font-weight: bold;
  font-size: 1.2rem;
  line-height: 1.5;
}

.control-section{
  position: absolute; /* Fixed positioning at the bottom */
  bottom: 0;
  left: 0;
  width: 100%;
  border-top-right-radius: 24px;
  border-top-left-radius: 24px;
  margin: auto;
  background: white;
  contain: none;
  overflow: visible;
}

.hint-button {
  position: absolute;
  top: -6vh;
  right: 4vw;
  --padding-start: 4vw;
  --padding-end: 4vw;
  --background:rgba(51, 61, 75, 0.6)
}


.control-buttons{
  padding: 0;
}

.control-button {
  --background: #F4F6F8;
  --box-shadow: none;
  --border-radius: 16px;
  --padding-start: 2vh;
  --padding-end: 2vh;
  --padding-top: 2vh;
  --padding-bottom: 2vh;
  height: 100%;
}

.button-content{
  display: flex;
  flex-direction: column;
  align-items: center;
  gap:1vh;
}

.button-title {
  color: #333D4B;
  font-weight: 600;
  line-height: 1.25;
  font-size: 1rem;
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

.disabled-button {
  --color: #A3A9B0
}

/* Media Query for Small Devices (e.g., Galaxy S8) */
@media screen and (max-width: 360px) {
  .card-container{
    margin-top: 5%;
  }
}

/* Media Query for Foldable Devices (e.g., Galaxy Z Fold) */
@media  (max-width: 345px) {
  .card-container{
    margin-top: 3%;
  }
}
</style>