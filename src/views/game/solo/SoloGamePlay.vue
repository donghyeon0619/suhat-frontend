<script setup lang="ts">
import {IonPage, IonContent, IonText, IonFooter, modalController, useIonRouter} from "@ionic/vue";
import BackButtonHeader from "@/components/common/BackButtonHeader.vue";
import PuzzleProgressChip from "@/components/game/PuzzleProgressChip.vue";
import GameCardBg from "@/assets/img/game/bg-game-card.svg"
import PuzzleSuccessModal from "@/components/game/PuzzleSuccessModal.vue";
import PuzzleFailureModal from "@/components/game/PuzzleFailureModal.vue";
import {enterAnimation, leaveAnimation} from "@/utils/puzzleModalAnimations";
import {computed, nextTick, ref} from "vue";
import BaseDoubleButtonFooter from "@/components/common/BaseDoubleButtonFooter.vue";
import {smartphoneTexts, TextOption} from "@/data/smartphoneTexts";
import {smartphonePicture, PictureOption} from "@/data/smartphonePicture";

const currentPieces =ref(0);
const maxPieces = ref(6);
const router = useIonRouter();
const isFlipped = ref(false);
const isResetting = ref(false);
const cardRefs = ref<HTMLElement[]>([]);
const cards = ref([
  { id: 1, isFlipped: false, type: 'text', content: ''},
  { id: 2, isFlipped: false, type: 'image', content: ''},
])

/**
 * 퍼즐 이미지 id 저장
 */
const puzzleImgId = ref<number>(1);

/**
 * todo 퍼즐 랜덤 부여 함수 선언
 */


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
 *  모든 퍼즐이 모이면 퍼즐 완성화면으로 라우팅
 */
const goPuzzleCompletion = () => {
    router.replace(
      {
        path: "/puzzlecompletion",
        query: {
          mode : "solo",
          puzzleImgId: String(puzzleImgId)
        }
      }
    );
};

/**
 * 퍼즐 획득 성공 모달 오픈 함수
 */
const openSuccessModal = async () => {
  const modal = await modalController.create({
    component: PuzzleSuccessModal,
    cssClass: 'chat-bubble-modal',
    enterAnimation: enterAnimation,
    leaveAnimation: leaveAnimation,
  });
  await modal.present();

  const {data, role} = await modal.onDidDismiss();

  // 현재 퍼즐 갯수 증가
  if(role === 'confirm'){
    currentPieces.value++;
    if (currentPieces.value >= maxPieces.value) {
      goPuzzleCompletion();
    }
  }
  resetCards(); // 카드 상태 초기화
};

/**
 * 퍼즐 획득 실패 모달 오픈 함수
 */
const openFailureModal = async () => {
  const modal = await modalController.create({
    component: PuzzleFailureModal,
    cssClass: 'chat-bubble-modal',
  });

  await modal.present();
  await modal.onDidDismiss();

  resetCards(); // 카드 상태 초기화
};

</script>
<template>
<IonPage>
  <BackButtonHeader></BackButtonHeader>
  <IonContent class="ion-padding" scroll-y="false">
    <div class="puzzle-progress-wrapper">
      <PuzzleProgressChip :currentPieces="currentPieces" :totalPieces="maxPieces"/>
    </div>
    <div class="card-container">
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
    <div class="question-box">
      <IonText class="question-box-text"> 이야기를 들은 당신의 생각은?</IonText>
    </div>
  </IonContent>
  <BaseDoubleButtonFooter
    :isButton1Disabled="!allCardsFlipped"
    :isButton2Disabled="!allCardsFlipped"
    @button1Click="openFailureModal"
    @button2Click="openSuccessModal"
    />
</IonPage>
</template>

<style scoped>
.ion-page {
  background: #ECEFF4;
}

ion-content::part(background) {
  background: transparent;
}

.puzzle-progress-wrapper{
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-container {
  display: flex;
  gap: 5vw;
  margin: 15vh 0;
}

.text-card, .face-card, .card-back{
  position: relative;
  width: 100%;
  min-height: 65vw;
  margin: 0 1vh 0 1vh;
}

.card-wrapper {
  position: relative;
  width: 100%;
  height: 65vw;
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
  min-width: 85%;
  z-index: 2;
  font-weight: 700;
  font-size: 1.2rem;
  line-height: 1.56;
  color: #ffffff;
}

.question-box{
  position: absolute;
  bottom: 3%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  padding: 2.5vh 2vh;
  width: 91%;
  display: flex;
  justify-content: center;
  align-items: center;
  .question-box-text{
    font-weight: 700;
    font-size: 1.125rem;
    line-height: 1.75;
  }
}
</style>