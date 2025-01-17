<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonText,
  IonAvatar,
  IonLabel,
  IonChip,
  IonCol,
  IonGrid,
  IonRow,
  useIonRouter,
} from "@ionic/vue";
import BaseDoubleButtonFooter from "@/components/common/BaseDoubleButtonFooter.vue";

// 아이콘 가져오기
import IconRankingFirst from "@/assets/icons/game/icon-ranking-first.svg"
import IconRankingSecond from "@/assets/icons/game/icon-ranking-second.svg"
import IconRankingThird from "@/assets/icons/game/icon-ranking-third.svg"
import IconRankingMan from "@/assets/icons/game/icon-ranking-man.png"
import IconRankingWoman from "@/assets/icons/game/icon-ranking-woman.png"
import IconRankingOther from "@/assets/icons/game/icon-ranking-other.png"
import {useRoute} from "vue-router";
import {RankingPlayer} from "@/types/Player";
import {deleteRequest, post} from "@/api/httpService";
import {useEventSourceStore} from "@/store/eventSourceStore";
import {showAlert} from "@/utils/showAlert";
import {useGameStore} from "@/store/gameStore";
import {ref} from "vue";

// 사용자 랭킹 인터페이스
interface UserRanking {
  name: string;
  puzzleCount: number;
  crownSrc: string;
  avatarSrc: string;
  rank: number;
}

const eventSourceStore = useEventSourceStore();

// 라우트에서 전달받은 데이터
const route = useRoute();
const router = useIonRouter();

const roomId = route.query.roomId || "";
const rankingData = JSON.parse(route.query.rankingData as string || "[]") as RankingPlayer[];
const gameStore = useGameStore();

// 순위별 왕관 이미지
const crownIcons = [IconRankingFirst, IconRankingSecond, IconRankingThird];

// 성별 아이콘 무작위 선택

// 성별 아이콘 무작위 선택
const randomGenderIcons = [IconRankingMan, IconRankingWoman, IconRankingOther];
const getRandomGenderIcon = () => {
  return randomGenderIcons[Math.floor(Math.random() * randomGenderIcons.length)];
};

const rankings = ref<UserRanking[]>(
  rankingData.map((player: any, index: number) => ({
    name: player.playerName,
    puzzleCount: player.puzzlePieces,
    crownSrc: crownIcons[index],  //순위에 맞는 왕관 이미지
    avatarSrc: getRandomGenderIcon(),
    rank: index + 1
  }))
)
// 각 사용자에 맞는 애니메이션 클래스를 반환하는 computed 속성 정의
const getRankAnimationClass = (rank: number) => `rank-${rank}`

const goRetry = async () => {
  try{
    const response = await post(`games/${roomId}/retry`, null, true);

    if (response.status == "200") {
      router.replace(`/game/waiting/${roomId}`);
      gameStore.setGameEnded(false);
    } else {
      console.log("다시하기 요청 이후 대기방으로 이동할 수 없음");
      await showAlert(
        "경고",
        "다시하기 요청 중 오류로 홈으로 이동", [
          {
            text: "확인", role: "confirm", handler: () => {
              router.replace("/game/home");
            }
          }]
      );
    }

  } catch (error) {
    console.log("게임 다시하기 요청 중 오류 발생", error);
    await showAlert(
      "경고",
      "다시하기 요청 중 오류로 홈으로 이동", [
        {
          text: "확인", role: "confirm", handler: () => {
            router.replace("/game/home");
          }
        }]
    );
  }
}

const goHome = async () => {
  try{
    const response = await deleteRequest(`rooms/${roomId}/players`, true);
    eventSourceStore.disconnectByUser();

    if (response.status == "200") {
      console.log('게임 종료 후 ')
      router.replace("/home");

    }
  } catch (error) {
    console.error('홈으로 이동 중 오류 발생');
  }
}

</script>
<template>
<IonPage>
  <IonHeader claa="ion-no-border">
    <IonToolbar></IonToolbar>
  </IonHeader>
  <IonContent class="ion-padding" scroll-y="false">
    <!-- 타이틀 색션 -->
    <div class="title-section">
      <IonText class="subtitle">함께하기 미션</IonText>
      <IonText class="title">순위 확인</IonText>
    </div>

    <!-- 랭킹 차트 섹션 -->
    <IonGrid class="chart-section ion-padding">
      <IonRow>
        <!-- 각각의 왕관 뱃지 및 막대 -->
        <IonCol
          v-for="(user, index) in rankings"
          :key="index"
          size="4"
          class="ranking-item"
          :style="{ order: user.rank === 2 ? 1 : user.rank === 1 ? 2 : 3 }"
        >
          <!-- 왕관 뱃지 요소 -->
          <div class="crown-badge">
            <div class="crown-avatar-wrapper">
              <img class="crown" :src="user.crownSrc" alt="왕관 이미지" />
              <IonAvatar
                class="avatar"
              >
                <img class="avatar-img" :src="user.avatarSrc" alt="Avatar Icon" />
              </IonAvatar>
            </div>
            <IonChip class="user-chip">
              <IonLabel class="user-name">{{user.name}}</IonLabel>
            </IonChip>
          </div>
          <!-- 막대 그래프 -->
          <div
            class="ranking-bar"
            :class="getRankAnimationClass(user.rank)"
          >
            <IonLabel class="rank-label">{{ user.rank}} 등</IonLabel>
          </div>
        </IonCol>
      </IonRow>
    </IonGrid>
  </IonContent>
  <BaseDoubleButtonFooter
    button-text1="다시하기"
    button-text2="게임 종료"
    @button1Click="goRetry"
    @button2Click="goHome"
  />
</IonPage>
</template>

<style scoped>
.ion-page{
  background-image: url('../../../assets/img/typetest/bg-type-test-page-dark.png'); /* 이미지를 직접 넣는 방법 */
}

ion-toolbar{
  --background: transparent;
}

ion-content::part(background) {
  background: transparent;
}

.title-section{
  display:flex;
  flex-direction: column;
  align-items: center;
}

.subtitle{
  font-size: 1rem;
  line-height: 1.5; /* Ratio-based */
  font-weight: 600; /* Semibold */
  color: #D9D9D9;
}

.title {
  font-size: 2rem;
  line-height: 1.375; /* Ratio-based */
  font-weight: 700; /* Bold */
  color: #ffffff;
}

/* Chart Section */
.chart-section {
  position: absolute;
  width: 100%;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
}

.ranking-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
}

.crown-badge{
  align-items: center;
  position: relative;
}

.crown-avatar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin-bottom: -3%;
}

.avatar {
  padding: 1.5vw; /* Adjust this to control the border thickness */
  background-color: #ffffff; /* White border color */
  margin-bottom: -10%;
  z-index: 2;
}

.crown{
  margin-bottom: -8%;
  z-index: 1;
}

.user-chip{
  --background: #FFFFFF;
  --color: transparent;
  padding: 0 4vw 0 4vw;
  border-radius: 12px;
}

.user-name{
  color: black;
  font-size: 0.875rem;
  font-weight: bold;
  line-height: 2;
}

.ranking-bar {
  width: 95%;
  background-color: #6A6776;
  border-radius: 8px;
  display: flex;
  align-items: end;
  justify-content: center;
  margin-top: 2vh;
  color: #ffffff;
  overflow: hidden; /* 애니메이션 중 콘텐츠 잘림 방지 */
  height: 0;
}

.rank-label {
  margin-bottom: 20%;
  font-size: 1.125rem;
  line-height: 1.125rem;
  font-weight: bold;
  text-align: center;
  color: #ffffff;
}

/* 순위별 애니메이션 클래스 */
@keyframes growHeightRank1 {
  from {
    height: 0;
  }
  to {
    height: 25vh;
  }
}

@keyframes growHeightRank2 {
  from {
    height: 0;
  }
  to {
    height: 18vh;
  }
}

@keyframes growHeightRank3 {
  from {
    height: 0;
  }
  to {
    height: 13vh;
  }
}

.rank-1 {
  animation: growHeightRank1 1.5s ease-in-out forwards;
}

.rank-2 {
  animation: growHeightRank2 1.5s ease-in-out forwards;
}

.rank-3 {
  animation: growHeightRank3 1.5s ease-in-out forwards;
}

</style>