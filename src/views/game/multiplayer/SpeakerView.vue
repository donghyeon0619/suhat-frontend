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
  IonIcon, IonThumbnail, modalController
} from "@ionic/vue";
import {onBeforeUnmount, onMounted, ref} from "vue";
import MikeIcon from "@/assets/icons/game/icon-mike.svg"
import GameCardBg from "@/assets/img/game/bg-game-card.svg";
import testImg from "@/assets/img/game/img-test-phone.png";
import {searchSharp} from "ionicons/icons";
import FlagIcon from "@/assets/icons/flag.svg"
import TimerIcon from "@/components/game/multiplayer/TimerIcon.vue";
import ChatBubbleModal from "@/components/common/ChatBubbleModal.vue";


const playerName = ref("김루리")

// 타이머 샛업
const initialTime = 180 // 3분 선언
const timer = ref(initialTime); //타이머 3분에서 시작
const formattedTime = ref(""); // "MM:SS"로 형식으로 화면에 보여줌
let timerInterval: ReturnType<typeof setInterval> | null = null;

// 시간 연장 유무
const hasExtended = ref(false);

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
      if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null; // Reset the interval to avoid reuse
      }
    }
  }, 1000);
}

// 시간 연장함수
const extendTime = () => {
  if (!hasExtended.value) {
    timer.value += 120;
    formattedTime.value = formatTime(timer.value);
    hasExtended.value = true;
  }
}

// 힌트 모달 오픈함수
const openCheerUpModal = async (message:string) => {
  const modal = await modalController.create({
    component: ChatBubbleModal,
    componentProps: { bubbleText: message},
    cssClass: 'chat-bubble-modal',
  });

  await modal.present();
  await modal.onDidDismiss();
};

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
        <IonLabel class="player-name">{{playerName}}</IonLabel>
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

    <!-- 하단 영역 -->
    <IonCard class="control-section ion-padding">

      <!-- 힌트보기 버튼 영역 -->
      <IonButton
        shape="round"
        class="hint-button"
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
  gap: 1vw;
  margin-top: 12%;

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
  padding: 1.5vh;
  max-width: 90%;
  z-index: 2;
  color: #000;
  font-weight: bold;
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