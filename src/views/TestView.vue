<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonAvatar,
  IonChip,
  IonCard,
  IonCardContent,
  IonRow,
  IonCol,
  IonButton,
  IonLabel,
  IonIcon, IonThumbnail, modalController, toastController, useIonRouter
} from "@ionic/vue";
import {computed, inject, nextTick, onBeforeUnmount, onMounted, ref, watch} from "vue";
import MikeIcon from "@/assets/icons/game/icon-mike.svg"
import GameCardBg from "@/assets/img/game/bg-game-card.svg";
import {searchSharp,} from "ionicons/icons";
import FlagIcon from "@/assets/icons/home/icon-flag.svg"
import TimerIcon from "@/components/game/multiplayer/TimerIcon.vue";
import {smartphoneTexts} from "@/data/smartphoneTexts";
import {smartphonePicture} from "@/data/smartphonePicture";
import GameExitHeader from "@/components/game/GameExitHeader.vue";

const isResetting = ref(false);


const cards = ref([
  { id: 1, isFlipped: false, type: 'text', content: ''},
  { id: 2, isFlipped: false, type: 'image', content: ''},
])


/**
 * 카드의 랜덤 데이터를 설정하는 함수
 */
const setRandomCardContent = (card: any) =>{
  if (card.type ==='text'){
    // 스마트폰 텍스트 옵션 중 무작위로 선택
    const randomIndex = Math.floor(Math.random() * smartphoneTexts.length);
    card.content = smartphoneTexts[randomIndex].text;
  } else if (card.type === 'image'){
    const randomIndex = Math.floor(Math.random() * smartphonePicture.length);
    card.content = smartphonePicture[randomIndex].url;
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


</script>
<template>
  <IonPage>
    <GameExitHeader header-title="라운드2" ></GameExitHeader>
    <IonContent scroll-y="false" >

    <!-- 발화자 표시 영역 -->
    <div class="speaker-profile-section">
      <IonAvatar class="mike">
        <img :src="MikeIcon" alt="마이크">
      </IonAvatar>
      <IonChip class="player-chip">
        <IonLabel class="player-name">hello</IonLabel>
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
          <IonLabel class="timer-text">남은 시간 test</IonLabel>
        </IonCol>
      </IonRow>
    </IonCard>
  </IonContent>
  </IonPage>
</template>
<style scoped>
.ion-page {
  background-image: url('../assets/img/typetest/bg-type-test-page.png'); /* 이미지를 직접 넣는 방법 */
}

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
    margin-top: 3%;
  }
}
</style>