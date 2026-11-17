<script setup lang="ts">
import {IonPage, IonContent, IonText, modalController, useIonRouter, onIonViewWillEnter} from "@ionic/vue";
import BackButtonHeader from "@/components/common/BackButtonHeader.vue";
import PuzzleProgressChip from "@/components/game/PuzzleProgressChip.vue";
import GameCardBg from "@/assets/img/game/bg-game-card.svg"
import PuzzleSuccessModal from "@/components/game/PuzzleSuccessModal.vue";
import PuzzleFailureModal from "@/components/game/PuzzleFailureModal.vue";
import {enterAnimation, leaveAnimation} from "@/utils/puzzleModalAnimations";
import {computed, nextTick, ref} from "vue";
import BaseDoubleButtonFooter from "@/components/common/BaseDoubleButtonFooter.vue";
import {soloSmartphoneTexts} from "@/data/soloSmartphoneTexts";
import {soloSmartphonePictures} from "@/data/soloSmartphonePictures";
import {soloTextPictureMatchingMap} from "@/data/soloTextPictureMatchingMap";

interface CardState {
  id: number;
  type: "text" | "picture";
  isFlipped: boolean;
  textId: number | null;    // 어떤 텍스트를 뽑았는지
  pictureId: number | null; // 어떤 그림을 뽑았는지
  content: string;          // 화면 표시용 (텍스트 or 그림 URL)
}

// 아직 매칭이 성공되지 않은 텍스트 id 목록
const remainingTextIds = ref<number[]>(soloSmartphoneTexts.map(t => t.id));
// 현재 턴에서 "비동의로"로 블랙리스트에 들어간 그림 id들
const currentTurnPictureBlacklist = ref<Set<number>>(new Set());

const currentPieces =ref(0);
const maxPieces = ref(6);
const router = useIonRouter();
const isResetting = ref(false);
const cardRefs = ref<HTMLElement[]>([]);

const cards = ref<CardState[]>([
  {id: 1, isFlipped: false, type: 'text', textId: null, pictureId: null, content: ''},
  {id: 2, isFlipped: false, type: 'picture', textId: null, pictureId: null, content: ''},
]);

/**
 * 글자카드 랜덤 부여함수
 * "남은 텍스트 ID"중 하나를 랜덤으로 뽑는 함수
 */
const pickRandomTextCard = () => {
  if (remainingTextIds.value.length === 0) return null;
  const rIndex = Math.floor(Math.random() * remainingTextIds.value.length);
  const chosenTextId = remainingTextIds.value[rIndex];
  const data = soloSmartphoneTexts.find(t => t.id === chosenTextId);
  if (!data) return null;
  return {textId: data.id, text: data.text};
}

/**
 * 그림카드 랜덤 부여 함수
 * 블랙리스트에 포함된 pid를 제외한 그림카드를 부여함
 */
const pickRandomPictureCard = () => {
  //먼저 현재 블랙리스트가 전체 그림카드를 커버하는지 확인
  const allPictureIds = soloSmartphonePictures.map(p => p.id);
  const isAllBlocked = allPictureIds.every(id => currentTurnPictureBlacklist.value.has(id));
  if (isAllBlocked) {
    currentTurnPictureBlacklist.value.clear();
  }

  // 블렉리스트를 제외한 그림카드
  const availableCard = soloSmartphonePictures.filter(pic => !currentTurnPictureBlacklist.value.has(pic.id));
  if (availableCard.length === 0) return null;

  const rIndex = Math.floor(Math.random() * availableCard.length);
  return availableCard[rIndex];
}

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

  if(!card || card.isFlipped) return;
  card.isFlipped = true;

  if (card.type === "text") {
    const chosen = pickRandomTextCard();
    if (!chosen) {
      card.content = "모든 글자카드를 다 사용했습니다."
      return;
    }
    card.textId = chosen.textId;
    card.pictureId = null;
    card.content = chosen.text;
  } else {
    const chosen = pickRandomPictureCard();
    if (!chosen) {
      card.content = "사용가능한 그림카드가 없습니다."
      return;
    }
    card.textId = null;
    card.pictureId = chosen.id;
    card.content = chosen.url;
  }
}

/**
 * 카드 상태 초기화 함수
 */
const resetCards = (isInitial = false) => {
  isResetting.value = true; // 리셋 시작

  // 모든 카드에 대해 리셋 애니메이션 적용
  cards.value.forEach(card => {
    card.isFlipped = false; // 뒷면으로 초기화
  });
  currentTurnPictureBlacklist.value.clear();

  // 만약 초기 리셋일 경우
  if(isInitial) {
    isResetting.value = false;
    return;
  }

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
 * 비동의 버튼 눌렀을 때 핸들러 함수
 */
const onDisagree = () => {
  const pictureCard = cards.value.find(c => c.type === "picture");
  if (!pictureCard) return;

  // 이미 뒤집힌 상태이면 블랙리스트 추가
  if (pictureCard.isFlipped && pictureCard.pictureId != null) {
    currentTurnPictureBlacklist.value.add(pictureCard.pictureId);
  }

  // 그림카드만 재배정 (다시 뒤집힘= false)
  pictureCard.isFlipped = false;
}

/**
 * 동의 버튼 눌렀을떄 핸들러 함수
 */
const onAgree = () => {
  const textCard = cards.value.find(c => c.type === "text");
  const pictureCard = cards.value.find(c => c.type === "picture");
  if (!textCard || !pictureCard) return;
  if (!textCard.isFlipped || !pictureCard.isFlipped) return;

  const tId = textCard.textId;
  const pId = pictureCard.pictureId;
  if (tId == null || pId == null) return;

  // soloMatchingMap[tId]에 pId가 포함되어있으면 매칭 성공
  const isMatched = soloTextPictureMatchingMap[tId]?.includes(pId) ?? false;

  if (isMatched) {
    // 매칭된 글자카드 ID는 다시 못 쓰도록 제거
    remainingTextIds.value = remainingTextIds.value.filter(id => id !== tId);
    openSuccessModal();
  } else {
    openFailureModal();
  }
}

/**
 *  모든 퍼즐이 모이면 퍼즐 완성화면으로 라우팅
 */
const goPuzzleCompletion = () => {
    router.replace(
      {
        path: "/puzzlecompletion",
        query: {
          mode: "solo",
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

/**
 * 페이지 진입 함수
 */
onIonViewWillEnter(() => {
  // 페이지 진입할 때마다 재초기화
  remainingTextIds.value = soloSmartphoneTexts.map(t => t.id);
  currentPieces.value = 0;  // 완전히 새 게임이면 퍼즐도 0으로
  resetCards(true);            // 필요하면 카드도 뒤집힘 상태로 초기화
});

</script>
<template>
<IonPage>
  <BackButtonHeader></BackButtonHeader>
  <IonContent class="ion-padding" :scroll-y="false">
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
        <!-- 글자 카드--->
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
        <!-- 그림카드 -->
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
      <IonText class="question-box-text">당신의 생각은?</IonText>
    </div>
  </IonContent>
  <BaseDoubleButtonFooter
    :isButton1Disabled="!allCardsFlipped"
    :isButton2Disabled="!allCardsFlipped"
    @button1Click="onDisagree"
    @button2Click="onAgree"
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