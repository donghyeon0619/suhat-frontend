<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonImg,
  IonThumbnail,
  IonRow,
  IonCol,
  useIonRouter, IonHeader, IonToolbar, onIonViewWillEnter
} from "@ionic/vue";
import ChatBubbleWithBorder from "@/components/common/ChatBubbleWithBorder.vue";
import PuzzleCompletionBadge from "@/assets/icons/game/icon-completion-badge.svg"
import SoloPuzzleImg from "@/assets/img/game/puzzle/img-solo-puzzle.png"
import MultiPuzzleImg from "@/assets/img/game/puzzle/img-multi-puzzle.png"
import SuhatSign from "@/assets/img/common/img-suhat-sign.svg"
import BaseButtonFooter from "@/components/common/BaseButtonFooter.vue";
import {onBeforeRouteLeave, useRoute} from "vue-router";
import {computed, ref} from "vue";

const router = useIonRouter();
const route = useRoute();

/**
 * mode를 ref로 만들어놓고, route.query.mode가 변경될 때마다 갱신해서
 * 라우트 재마운트 없이도 화면이 업데이트 되도록 처리
 */
const mode = ref("");


/**
 * puzzleImage 또한 mode 값을 보고 동적으로 결정
 */
const puzzleImage = computed(() => {
  return mode.value === "solo" ? SoloPuzzleImg : MultiPuzzleImg;
});

/**
 * 멀티 모드일 때만 랭킹 데이터를 파싱
 */
const rankingData = ref<any[]>([]);

const roomId = ref(route.query.roomId as string || "");

/**
 * 홈 리우팅 함수
 */
const goHome = () =>{
  console.log("홈으로 이동")
  router.replace("/home");
}

/**
 * 랭킹 페이지로 이동 함수
 */
const goRanking = () => {
  if(rankingData.value.length > 0){
    router.replace({
      path: "/multi/ranking",
      query: {
        rankingData: JSON.stringify(rankingData.value),
        roomId: roomId.value,
      }
    })
  } else {
    console.error("랭킹 데이터가 없습니다.")
  }
}

/**
 * 버튼 클릭 이벤트 핸들러함수
 */
const handleButtonClick = () => {
  if (mode.value === 'solo') {
    goHome();
  } else {
    goRanking();
  }
};

/**
 * 쿼리 값 업데이트를 위한 함수
 */
const updateQueryData = () => {
  const queryMode = route.query.mode as string | undefined;
  if (queryMode) {
    mode.value = queryMode;
  }

  if (route.query.rankingData) {
    try {
      // URL 인코딩된 rankingData 디코딩 후 JSON 파싱
      const decodedRankingData = decodeURIComponent(route.query.rankingData as string);
      rankingData.value = JSON.parse(decodedRankingData);
    } catch (e) {
      console.error("랭킹 데이터 파싱 오류:", e);
    }
  }
};

/**
 * 페이지가 진입할 때 업데이트
 */
onIonViewWillEnter(() => {
  updateQueryData();
});


/**
 * 뒤로가기 로직 막기
 */
onBeforeRouteLeave(async (to, from, next) =>{
  if (to.name === 'HomePage' || to.name === 'GameRanking') {
    next();
  } else {
    next(false);
  }
})

</script>

<template>
<IonPage>
  <IonHeader class="ion-no-border">
    <IonToolbar></IonToolbar>
  </IonHeader>
  <IonContent class="ion-padding" scroll-y="false">
    <!-- Congratulatory Title -->
    <div class="title-section">
      <IonText class="completion-subtitle">
        {{ mode === 'solo' ? '혼자하기 미션' : '함께하기 미션' }}
      </IonText>
      <IonText class="completion-title">퍼즐 완성!</IonText>
    </div>

      <!-- Puzzle Image Card Section -->
      <IonCard class="puzzle-completion-card ion-padding">
        <img class="puzzle-completion-badge" :src="PuzzleCompletionBadge" alt="핼로우"/>
        <IonCardHeader class="card-header">
          <IonCardTitle class="card-title">내 완성 퍼즐</IonCardTitle>
        </IonCardHeader>
        <IonCardContent class="card-content">
          <IonThumbnail class="puzzle-img-wrapper">
            <IonImg :src="puzzleImage" class="puzzle-img"/>
          </IonThumbnail>
          <IonRow class="ion-align-items-center">
            <IonCol size="9" class="puzzle-description-col">
              <IonText class="puzzle-description">
                올바른 스마트폰 이용을 위한 첫 걸음을 내딛은 걸 축하해!
              </IonText>
            </IonCol>
            <IonCol size="3">
                <img :src="SuhatSign" alt="수햇사인" class="suhat-sign" />
            </IonCol>
          </IonRow>
        </IonCardContent>
      </IonCard>
    <div class="chat-bubble-wrapper">
      <ChatBubbleWithBorder
        message=
          "퍼즐을 완성한 걸 축하해!
          <br>이제 스마트폰 없이도 나와 같이 재미있는 일상을 보내보자"
        bubble-font-size="1rem"
      >
      </ChatBubbleWithBorder>
    </div>
  </IonContent>
  <BaseButtonFooter
    :buttonText="mode === 'solo' ? '끝내기' : '내 순위 확인하기'"
    buttonColor="#13BD7E"
    @buttonClick="handleButtonClick"
  />
</IonPage>
</template>

<style scoped>
ion-toolbar{
  --background: transparent;
}

.ion-page{
  background-image: url('../../assets/img/typetest/bg-type-test-page-dark.png'); /* 이미지를 직접 넣는 방법 */
}

ion-content::part(background) {
  background: transparent;
}

.title-section{
  display:flex;
  flex-direction: column;
  align-items: center;
}

.completion-subtitle{
  font-size: 1rem;
  line-height: 1.5; /* Ratio-based */
  font-weight: 600; /* Semibold */
  color: #D9D9D9;
}

.completion-title {
  font-size: 2rem;
  line-height: 1.375; /* Ratio-based */
  font-weight: 700; /* Bold */
  color: #ffffff;
}

.puzzle-completion-card{
  margin: 3vh auto;
  padding-bottom: 0;
  width: 70%;
  position: relative;
  min-height: 40vh;
  --background: #F5F5F5;
  border-radius: 24px;
  contain: none;
  overflow: visible;
}

.card-header{
  align-items: center;
  padding-top:0;
  padding-bottom:5%;
}

.card-title{
  font-weight: 700;
  font-size: 1.125rem;
  color: #59606B;
}

.puzzle-completion-badge{
 position: absolute;
  top: -2vh;
  right: 2vh;
}

.card-content{
  padding-left: 2vw;
  padding-right: 2vw;
  padding-bottom: 0;
}

.puzzle-img-wrapper{
  --size: 100%;
}


.puzzle-description{
  font-size: 0.75rem; /* Equivalent to 12px */
  line-height: 1.833; /* Ratio-based line height */
  font-weight: 700;
  color: #59606B;
}


.chat-bubble-wrapper{
  position: absolute;
  bottom: 3%;
  left: 50%;
  transform: translateX(-50%);
  width: 91%;
}

/* Media Query for Small Devices (e.g., Galaxy S8) */
@media(max-width: 360px) {
}

/* Media Query for Foldable Devices (e.g., Galaxy Z Fold) */
@media  (max-width: 345px) {
  ion-row{
    margin-top: 2vh;
  }
}
</style>