<script setup lang="ts">
import {
  IonContent,
  IonAvatar,
  IonChip,
  IonRow,
  IonCol,
  IonButton,
  IonLabel, toastController,
} from "@ionic/vue";
import {onBeforeUnmount, onMounted, ref} from "vue";
import MikeIcon from "@/assets/icons/game/icon-mike.svg"
import GameCardBg from "@/assets/img/game/bg-game-card.svg";
import testImg from "@/assets/img/game/img-test-phone.png";

// props 선언
const props = defineProps({
  currentSpeaker:{
    type:String,
    required: true
  }
})

const emit = defineEmits(["nextPhase"]);

// 타이머 샛업
const initialTime = 60 // 3분 선언
const timer = ref(initialTime); //타이머 3분에서 시작
const formattedTime = ref(""); // "MM:SS"로 형식으로 화면에 보여줌
let timerInterval: ReturnType<typeof setInterval> | null = null;


// "MM:SS" 로 바꾸는 함수
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

// 타이머 시작 함수
const startTimer = () => {
  formattedTime.value =formatTime(timer.value);
  timerInterval = setInterval(()=>{
    timer.value -= 1;
    formattedTime.value = formatTime(Math.max(timer.value, 0)); // 음수로 내려가지 않도록 보장

    if (timer.value <= 0) { // 타이머 종료 조건
      clearInterval(timerInterval!); // timerInterval이 null이 아님을 보장
      timerInterval = null; // 초기화
      emit("nextPhase"); // 시간이 다 지나면 다음 단계로 전환
    }
  }, 1000);
}

// 시간 연장시 상단 토스트 출현
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

// mount 될 시 타이머 시작
onMounted(() => {
  startTimer();
})
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
      <div class="text-card">
        <img :src="GameCardBg" alt="Background" class="card-background" />
        <IonLabel class="card-text">스마트폰을 <br>손에서 놓지 않음</IonLabel>
      </div>
      <div class="face-card">
        <img :src="GameCardBg" alt="Background" class="card-background" />
        <img :src="testImg" class="card-picture" alt="그림이미지">
      </div>
    </div>

  </IonContent>
  <IonRow class="card-footer ion-padding ">
    <div class="speech-bubble-wrapper">
      <div class="speech-bubble">
        <IonLabel>(설정- 디지털 웰빙 및 자녀 보호기능)에서 확인가능!</IonLabel>
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
  gap: 1vw;
  margin-top: 20%;

}

.text-card,
.face-card {
  position: relative;
  width: 100%;
  min-height: 60vw;
  margin: 0 1vh 0 1vh;
  display: flex;
  align-items: center;
  justify-content: center;
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
  max-width: 70%;
  z-index: 2;
  font-size: 1.125rem;
  font-weight: bold;
  color: #ffffff;
  line-height: 1.6;
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
  margin: 7% 1% 15% 1%;
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
    margin-top: 15%;
  }
}

/* Media Query for Foldable Devices (e.g., Galaxy Z Fold) */
@media  (max-width: 345px) {
  .card-container{
    margin-top: 25%;
  }
}


</style>