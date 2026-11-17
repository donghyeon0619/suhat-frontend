<script setup lang="ts">
import { IonAvatar, IonChip, IonCol, IonContent, IonLabel, IonRow } from '@ionic/vue';
import MikeIcon from '@/assets/icons/game/icon-mike.svg';
import GameCardBg from '@/assets/img/game/bg-game-card.svg';
import { Player } from '@/types/Player';
import { useSpeakingState } from '@/composables/useSpeakingState';
defineProps<{ currentSpeaker: Player }>();
const { timer, formattedTime, cards } = useSpeakingState();
</script>

<template>
  <IonContent :scroll-y="false" >
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