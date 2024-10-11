<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonText,
  IonLabel,
  IonButton,
  IonCard,
  IonGrid,
  IonRow,
  IonCol,
  IonFooter, useIonRouter
} from "@ionic/vue";
import {computed, ref, watch} from "vue";
import { chevronBackOutline} from "ionicons/icons";


// 덤프 데이터: 질문 리스트
const questions = ref([
  "스마트폰의 사용목적을 분명히 하여 필요할 때만 사용한다",
  "스마트폰 사용 중에 다른 업무에 집중하지 못한다",
  "자기 전에 스마트폰을 자주 사용한다",
  "스마트폰을 사용하지 않으면 불안함을 느낀다",
  "다른 사람들과 있을 때 스마트폰을 자주 확인한다",
  "스마트폰 사용 시간을 조절하기 어렵다",
  "스마트폰을 사용하면서 중요한 일을 자주 놓친다",
  "하루 중 많은 시간을 스마트폰에 투자한다",
  "스마트폰 사용이 나의 일상에 지장을 준다",
  "스마트폰 없이 지내는 것이 어렵다",
  "스마트폰으로 인해 다른 사람들과의 관계가 소홀해진다",
  "스마트폰으로 인해 학습이나 업무 성과가 낮아진다",
  "스마트폰 사용을 줄이려고 노력해본 적이 있다",
  "스마트폰 사용 시간이 다른 사람들보다 많다",
  "스마트폰을 사용하지 않으면 지루함을 느낀다"
]);

// 현재 질문 번호와 선택된 답변들 저장
const currentQuestionIndex = ref(0);
const selectedAnswers = ref<number[]>(Array(questions.value.length).fill(-1));

// 선택지 데이터
const options = ref([
  { text: '전혀<br>그렇지 않다', value:1 },
  { text: '<br>그렇지 않다', value:2 },
  { text: '<br>보통이다', value:3 },
  { text: '<br>그렇다', value:4 },
  { text: '매우<br>그렇다', value:5 },
]);

// 현재 질문에 대해 답변이 선택되었는지 확인
const isOptionSelected = computed(() => selectedAnswers.value[currentQuestionIndex.value] !== -1);


// 선택된 답변 핸들러
const selectOption = (value: number) => {
  if (selectedAnswers.value[currentQuestionIndex.value] === value) {
    // 동일한 옵션을 다시 선택하면 선택을 취소
    selectedAnswers.value[currentQuestionIndex.value] = -1;
  } else {
    // 새로운 옵션을 선택하면 해당 값 저장
    selectedAnswers.value[currentQuestionIndex.value] = value;
  }
};

const totalScore = computed(()=>{
  return selectedAnswers.value.reduce((sum, current) => sum + (current !== -1 ? current : 0), 0)
})

// 이전 문제 버튼 클릭 핸들러
const goToPreviousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  }
};

// 다음 문제 버튼 클릭 핸들러
const goToNextQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++;
  }
};

// 제출하기 버튼 클릭 핸들러
const router = useIonRouter();

const submitSurvey = () => {
  // 제출 처리 후 결과 페이지로 이동
  router.push({
    name: "SurveyResult",
    query: {score:totalScore.value}
  });
};
</script>

<template>
  <IonPage>
    <IonHeader class="ion-no-border">
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton :icon="chevronBackOutline" default-href="/"></IonBackButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>

    <IonContent class="ion-padding">
      <!-- 질문 영역 -->
      <div class="survey-container">
        <IonLabel class="survey-number">
          퀴즈 {{currentQuestionIndex + 1}}/15</IonLabel>
        <IonLabel class="survey-title">{{ questions[currentQuestionIndex]}}</IonLabel>
        <IonText class="survey-subtitle">나와 가장 가까운 문항을 선택해주세요</IonText>
      </div>

      <!-- 선택지 영역 -->
      <IonGrid>
        <IonRow class="ion-justify-content-center">
          <IonCol size="4" v-for="(option, index) in options.slice(0,2)" :key="index">
            <IonCard
                class="option-item"
                :class="{ 'selected': selectedAnswers[currentQuestionIndex] === option.value }"
                @click="selectOption(option.value)"
            >
              <div class="option-content">
                <div class="option-text" v-html="option.text"></div>
                <!-- 조건에 따라 다른 SVG 렌더링 -->
                <div v-if="selectedAnswers[currentQuestionIndex] === option.value" class="check-icon">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 28C21.7319 28 28 21.7319 28 14C28 6.26801 21.7319 0 14 0C6.26801 0 0 6.26801 0 14C0 21.7319 6.26801 28 14 28Z" fill="#13BD7E" fill-opacity="0.94902"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M20.9695 10.1338C21.3799 10.5033 21.4132 11.1356 21.0437 11.546L13.8604 19.5259C13.4763 19.9526 12.8128 19.969 12.408 19.562L7.62623 14.753C7.23682 14.3614 7.23861 13.7283 7.63023 13.3388L8.6939 12.2812C9.08553 11.8917 9.71871 11.8935 10.1081 12.2852L12.2816 14.471C12.6863 14.8781 13.3499 14.8616 13.7339 14.435L18.4423 9.20441C18.8118 8.79394 19.4441 8.76072 19.8546 9.13021L20.9695 10.1338Z" fill="white"/>
                  </svg>
                </div>
                <div v-else class="check-icon">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 28C21.7319 28 28 21.7319 28 14C28 6.26801 21.7319 0 14 0C6.26801 0 0 6.26801 0 14C0 21.7319 6.26801 28 14 28Z" fill="#F2F2F2"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M20.9695 10.1338C21.3799 10.5033 21.4132 11.1356 21.0437 11.546L13.8604 19.5259C13.4763 19.9526 12.8128 19.969 12.408 19.562L7.62623 14.753C7.23682 14.3614 7.23861 13.7283 7.63023 13.3388L8.6939 12.2812C9.08553 11.8917 9.71871 11.8935 10.1081 12.2852L12.2816 14.471C12.6863 14.8781 13.3499 14.8616 13.7339 14.435L18.4423 9.20441C18.8118 8.79394 19.4441 8.76072 19.8546 9.13021L20.9695 10.1338Z" fill="white"/>
                  </svg>
                </div>
              </div>
            </IonCard>
          </IonCol>
        </IonRow>

        <IonRow class="ion-justify-content-center">
          <IonCol size="4" v-for="(option, index) in options.slice(2)" :key="index+2">
            <IonCard
                class="option-item"
                :class="{ 'selected': selectedAnswers[currentQuestionIndex] === option.value }"
                @click="selectOption(option.value)"
            >
              <div class="option-content">
                <div class="option-text" v-html="option.text"></div>
                <!-- 조건에 따라 다른 SVG 렌더링 -->
                <div v-if="selectedAnswers[currentQuestionIndex] === option.value" class="check-icon" >
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 28C21.7319 28 28 21.7319 28 14C28 6.26801 21.7319 0 14 0C6.26801 0 0 6.26801 0 14C0 21.7319 6.26801 28 14 28Z" fill="#13BD7E" fill-opacity="0.94902"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M20.9695 10.1338C21.3799 10.5033 21.4132 11.1356 21.0437 11.546L13.8604 19.5259C13.4763 19.9526 12.8128 19.969 12.408 19.562L7.62623 14.753C7.23682 14.3614 7.23861 13.7283 7.63023 13.3388L8.6939 12.2812C9.08553 11.8917 9.71871 11.8935 10.1081 12.2852L12.2816 14.471C12.6863 14.8781 13.3499 14.8616 13.7339 14.435L18.4423 9.20441C18.8118 8.79394 19.4441 8.76072 19.8546 9.13021L20.9695 10.1338Z" fill="white"/>
                  </svg>
                </div>
                <div v-else class="check-icon">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 28C21.7319 28 28 21.7319 28 14C28 6.26801 21.7319 0 14 0C6.26801 0 0 6.26801 0 14C0 21.7319 6.26801 28 14 28Z" fill="#F2F2F2"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M20.9695 10.1338C21.3799 10.5033 21.4132 11.1356 21.0437 11.546L13.8604 19.5259C13.4763 19.9526 12.8128 19.969 12.408 19.562L7.62623 14.753C7.23682 14.3614 7.23861 13.7283 7.63023 13.3388L8.6939 12.2812C9.08553 11.8917 9.71871 11.8935 10.1081 12.2852L12.2816 14.471C12.6863 14.8781 13.3499 14.8616 13.7339 14.435L18.4423 9.20441C18.8118 8.79394 19.4441 8.76072 19.8546 9.13021L20.9695 10.1338Z" fill="white"/>
                  </svg>
                </div>
              </div>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>

    </IonContent>
    <!-- 하단 영역 -->
    <IonFooter class="ion-no-border">
      <ion-grid>
        <ion-row>
          <ion-col size="6">
            <ion-button
                expand="block"
                fill="outline"
                class="prev-button"
                @click="goToPreviousQuestion">이전 문제</ion-button>
          </ion-col>
          <ion-col size="6">
            <ion-button
                expand="block"
                class="next-button"
                :disabled="!isOptionSelected"
                @click="currentQuestionIndex === questions.length - 1 ? submitSurvey() : goToNextQuestion()"
            >
              {{ currentQuestionIndex === questions.length - 1 ? "제출하기" : "다음 문제" }}
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </IonFooter>
  </IonPage>
</template>

<style scoped>
.ion-page {
  background: linear-gradient(180deg, #FDFFEF 0%, #DBEDB3 100%);
}

ion-toolbar{
  --background: transparent;
}

ion-content::part(background) {
  background: transparent;
}


ion-back-button{
  --padding-start: 0;
}

ion-buttons{
  margin-left: 0;
}

.survey-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 25%;
}

.survey-number{
  --border-color: transparent;
  line-height: 1.25;
  color: #13BD7E;
  font-weight: 600;
}

.survey-title {
  margin: 8% 3% 5% 3%;
  font-weight: 700;
  text-align: center;
  font-size: 1.625rem;
  line-height: 1.538;
  color: #333D4B;
}

.survey-subtitle {
  font-size: 0.875rem;
  line-height: 1.429;
  color: #6b7684;
  font-weight: 500;
  margin-top: 1vh;
}

ion-grid{
  --ion-grid-padding:0;
}

.option-item {
  border-radius: 30px;
  border: 2.4px solid #F2F2F2;
  background: #FFF;
  min-height: 17vh;
  width: 100%;
  padding: 2vh 0.5vh 2vh 0.5vh !important;
  margin:0 !important;
  transition: all 0.3s ease;  /* 트랜지션 추가 */
  box-shadow: 0 0 20px 0 #FF583326;
}

.option-item.selected {
  border: 2.4px solid rgba(19, 189, 126, 0.95); /* 선택된 버튼의 테두리 색상 */
}

.option-text {
  text-align: center;
  line-height: 1.25;
  font-size: 1rem;
  font-weight: 600;
  color: #99989D;
  white-space: normal;
  word-wrap: break-word;
  padding-top: 20%; /* 텍스트 위쪽에 여백을 줘서 조정 */
  transition: padding-top 0.3s ease;  /* 애니메이션 추가 */

}


.check-icon {
  position: absolute;
  bottom: 1.5vh;
  left: 50%;
  transform: translateX(-50%);  /* 수평 가운데 정렬 */
  display: flex;
  justify-content: center;
  text-align: center;
}

ion-footer{
  height: 15%;
  padding: 0 1.5vh 0 1.5vh;

}

.prev-button, .next-button {
  --border-radius: 16px;
  --border-color: transparent;
  line-height: 1.25;
  font-size:1rem;
  font-weight: 600;
  --padding-start: 3vh;
  --padding-end: 3vh;
  --padding-top: 2vh;
  --padding-bottom: 2vh;
}

.prev-button{
  color:#6B7684;
  --background: #FFF;
}

.next-button{
  --background: #13BD7E;
}

.next-button:disabled{
  --background:#BBE5A6 ;
}
</style>