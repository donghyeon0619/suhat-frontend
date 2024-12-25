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
  IonIcon, IonThumbnail, modalController, toastController
} from "@ionic/vue";
import {computed, nextTick, onBeforeUnmount, onMounted, ref, watch} from "vue";
import MikeIcon from "@/assets/icons/game/icon-mike.svg"
import GameCardBg from "@/assets/img/game/bg-game-card.svg";
import testImg from "@/assets/img/game/img-test-phone.png";
import {searchSharp} from "ionicons/icons";
import FlagIcon from "@/assets/icons/home/icon-flag.svg"
import TimerIcon from "@/components/game/multiplayer/TimerIcon.vue";
import ChatBubbleModal from "@/components/common/ChatBubbleModal.vue";
import HintModal from "@/components/game/multiplayer/HintModal.vue";

/**
 * props 정의
 */
const props = defineProps({
  currentSpeaker : {
    type : String,
    required: true,
  }
})

/**
 * emit정의
 */
const emit = defineEmits(["nextPhase"]);

/**
 *  타이머 샛업
  */
const initialTime = 180 // 3분 선언
const timer = ref(initialTime); //타이머 3분에서 시작
const formattedTime = ref("3:00"); // "MM:SS"로 형식으로 화면에 보여줌
let timerInterval: ReturnType<typeof setInterval> | null = null;

// 시간 연장 유무
const hasExtended = ref(false);


/**
 * 카드 애니메이션
 */
const isFlipped = ref(false);
const isResetting = ref(false);
const cardRefs = ref<HTMLElement[]>([]);

const cards = ref([
  { id: 1, isFlipped: false, type: 'text', content: ''},
  { id: 2, isFlipped: false, type: 'image', content: ''},
])

/**
 * 랜덤 데이터 설정
 */
const textOptions = [
  '스마트폰을 <br> 손에서 놓지 않음',
  '놀러가고 싶다',
  '책을 읽지 않음',
  '잠을 잘 못 잠'
];
const imageOptions = [
  testImg, // 현재 사용 중인 이미지
  'https://via.placeholder.com/150', // 테스트용 이미지
  'https://via.placeholder.com/200',
  'https://via.placeholder.com/250'
];

/**
 * 카드의 랜덤 데이터를 설정하는 함수
 */
const setRandomCardContent = (card: any) =>{
  if (card.type ==='text'){
    card.content = textOptions[Math.floor(Math.random() * textOptions.length)];
  } else if (card.type === 'image'){
    card.content = imageOptions[Math.floor(Math.random() * imageOptions.length)];
  }
}

/**
 * 카드 초기화
 */
cards.value.forEach(setRandomCardContent);

/**
 * 모든 카드가 뒤집혔는지 여부를 확인하는 computed
 */
const allCardsFlipped = computed(() => {
  return cards.value.every(card => card.isFlipped);
});

/**
 * allCardsFlipped 값이 변경될 때 실행 하는 watch 함수
 */
watch(allCardsFlipped, (newVal) => {
  if (newVal) {
    startTimer(); // 모든 카드가 뒤집혔을 때 타이머 시작
  }
});
/**
 * 카드 뒤집기 함수
 */
const toggleFlip = (id: number) => {
  if (isResetting.value) return; // 리셋 중에는 클릭 방지

  const card = cards.value.find(c => c.id === id);
  if(card && !card.isFlipped){
    card.isFlipped = true;
    setRandomCardContent(card);
  }
}

/**
 * 카드 상태 초기화 함수
 */
const resetCards = () => {
  isResetting.value = true; // 리셋 시작

  // 모든 카드에 대해 리셋 애니메이션 적용
  cards.value.forEach(card => {
    card.isFlipped = false; // 뒷면으로 초기화
  });

  // 애니메이션 완료 이벤트 등록
  nextTick(() => {
    cardRefs.value.forEach((cardElement) => {
      cardElement.addEventListener(
        "transitionend",
        () => {
          isResetting.value = false;
        },
        {once: true}
      );
    })
  })
};

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
const startTimer = () => {
  formattedTime.value =formatTime(timer.value);
  timerInterval = setInterval(()=>{
    if (timer.value > 0){
      timer.value -= 1
      formattedTime.value =formatTime(timer.value);
      // 이 때 1분 남았는지 확인
      if (timer.value === 60) {
        const message = hasExtended.value
          ? "한 번 시도해보고, 잘 안 되면 다시 해봐도 괜찮아요. 중요한 건 시도하는 거예요!"
          : "천천히 생각해보고, 생각난 대로 말해보세요. 괜찮아요!";
        openCheerUpModal(message);
      }
    } else {
      stopTimer();
      emit("nextPhase"); // 시간이 다 지나면 다음 단계로 전환
    }
  }, 1000);
}

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
const handleEndSpeaking = () => {
  stopTimer();
  emit("nextPhase"); // 다음 단계로 전환
};


/**
 * 시간 연장함수
 */
const extendTime = () => {
  if (!hasExtended.value) {
    timer.value += 120;
    formattedTime.value = formatTime(timer.value);
    hasExtended.value = true;
  }
  presentToast();
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
        <IonLabel class="player-name">{{currentSpeaker}}</IonLabel>
      </IonChip>
    </div>

    <!-- 게임 카드 진행 영역 -->
    <div class="card-container ion-padding">
      <!-- 애니메이션 들어간 카드 -->
      <div
        v-for="card in cards"
        :key="card.id"
        ref="cardRefs"
        class="card-wrapper"
        :class="{ flipped: card.isFlipped }"
        @click="toggleFlip(card.id)"
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
      <IonRow class="card-footer ">
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
  padding: 0.8vh 3.8vw;
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
  padding: 1.5vh;
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
  margin: 7% 1% 15% 1%;
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
    margin-top: 12%;
  }
}
</style>