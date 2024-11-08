<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonText,
  IonLabel,
  IonButton,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonFooter, useIonRouter, onIonViewWillEnter,
} from "@ionic/vue";
import {computed, ref, reactive, watch} from "vue";
import { chevronBackOutline} from "ionicons/icons";
import SuhatChip from "@/components/common/SuhatChip.vue";
import { surveyData } from "@/data/surveyData";
import {useRoute} from "vue-router";

const router = useIonRouter();

const route = useRoute();
const serviceType= route.query.serviceType;

// 현재 질문 번호와 선택된 답변들 저장
const currentQuestionIndex = ref(0);
const selectedAnswers = reactive<number[]>(Array<number>(surveyData.length).fill(-1));

// 현재 질문에 대해 답변이 선택되었는지 확인
const isOptionSelected = computed(() => selectedAnswers[currentQuestionIndex.value] !== -1);

// 페이지 렌더링 시 현재 질문번호 및 선택된 답변 초기화
onIonViewWillEnter(()=>{
  currentQuestionIndex.value = 0;
  selectedAnswers.fill(-1);
})

// 선택된 답변 핸들러
const selectOption = (value: number) => {
  if (selectedAnswers[currentQuestionIndex.value] === value) {
    // 동일한 옵션을 다시 선택하면 선택을 취소
    selectedAnswers[currentQuestionIndex.value] = -1;
  } else {
    // 새로운 옵션을 선택하면 해당 값 저장
    selectedAnswers[currentQuestionIndex.value] = value;
  }
};

const totalScore = computed(()=>{
  return selectedAnswers.reduce((sum, current) => sum + (current !== -1 ? current : 0), 0)
})

// 이전 문제 버튼 클릭 핸들러
const goToPreviousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  }
};

// 다음 문제 버튼 클릭 핸들러
const goToNextQuestion = () => {
  if (currentQuestionIndex.value < surveyData.length - 1) {
    currentQuestionIndex.value++;
  }
};

// 제출하기 버튼 클릭 핸들러
const submitSurvey = () => {
  // 제출 처리 후 결과 페이지로 이동
  router.push({
    name: "TypeTestResult",
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
        <IonTitle class="page-title">{{serviceType}} 유형검사</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent class="ion-padding" scroll-y="false">

      <!-- 질문 영역 -->
      <div class="question-container">
        <IonText class="question-number">
          <IonLabel style="color: #13BD7E">{{currentQuestionIndex + 1}}</IonLabel>/15
        </IonText>
        <IonLabel class="question-title">{{ surveyData[currentQuestionIndex].question}}</IonLabel>
      </div>

      <div class="option-container">
        <!-- 대화형 말풍선 -->
        <div class="chat-bubble">
          <div class="speech-bubble">
            <IonLabel>
              나와 가장 가까운 대답을 골라줘
            </IonLabel>
          </div>
          <SuhatChip font-size="0.75rem"></SuhatChip>
        </div>

        <!-- 선택지 -->
        <IonCard>
          <IonCardContent>
            <IonList lines="none" class="option-list">
              <IonItem
                  v-for="option in surveyData[currentQuestionIndex]?.options"
                  :key="option.value"
                  class="option-item"
                  :class="{ 'selected-option' : selectedAnswers[currentQuestionIndex] === option.value}"
                  @click="selectOption(option.value)"
              >
                <ion-label class="option-text">{{option.text}}</ion-label>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

      </div>
    </IonContent>

    <!-- 하단 영역 -->
    <IonFooter class="ion-no-border">
      <ion-grid>
        <ion-row>
          <ion-col size="5">
            <ion-button
                expand="block"
                class="prev-button"
                @click="goToPreviousQuestion">이전 문제</ion-button>
          </ion-col>
          <ion-col size="7">
            <ion-button
                expand="block"
                class="next-button"
                :disabled="!isOptionSelected"
                @click="currentQuestionIndex === surveyData.length - 1 ? submitSurvey() : goToNextQuestion()"
            >
              {{ currentQuestionIndex === surveyData.length - 1 ? "제출하기" : "선택완료" }}
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </IonFooter>
  </IonPage>
</template>

<style scoped>
.ion-page {
  background-image: url('../../assets/img/typetest/bg-type-test-page.png'); /* 이미지를 직접 넣는 방법 */
}
ion-toolbar{
  --background: transparent;
  position: relative;
}

.page-title{
  color: #333D4B;
  position: absolute;
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.25;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
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

.question-container {
  margin-top: 5%;
  display: flex;
  flex-direction: column;
  align-items: start;
  min-height: 12vh;
}

.question-number{
  --border-color: transparent;
  line-height: 1.25;
  color: #333D4B;
  font-weight: 600;
}

.question-title {
  margin-top: 3%;
  font-weight: 800;
  width: 100%;
  text-align: start;
  font-size: 1.75rem;
  line-height: 1.3;
  color: #333D4B;
}

.suhat-chip{
  position: absolute;
  top: -85%;
  left: 3%;
  z-index: 4;
}

.chat-bubble{
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 15%;
}

.speech-bubble{
  position: relative;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  border: 3px solid #F2F2F2;
  padding: 1.5% 10% 2% 6%;
  ion-label{
    font-weight: 900;
    font-size: 0.75rem;
    line-height: 1.25;
    color: #333D4B;
  }
  z-index: 2;
}

/* 꼬리 만들기 */
.speech-bubble::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 25%;
  width: 0;
  height: 0;
  border: 15px solid transparent;
  border-top-color:rgba(255, 255, 255, 0.8); /* 말풍선 배경 색상 */
  border-bottom: 0;
  margin-left: -15px;
  margin-bottom: -14px;
  z-index:3;
}

.speech-bubble::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 25%;
  width: 0;
  height: 0;
  border: 17px solid transparent;
  border-top-color: #F2F2F2; /* 테두리 색상 */
  border-bottom: 0;
  margin-left: -17px;
  margin-bottom: -17px;
  z-index: 1;
}

ion-card{
  width: 100%;
  border: 3px solid #F2F2F2;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: none;
  margin: 5% 0 5% 0;
}

.option-list{
  padding: 0;
}

.option-item{
  --background: #F4F6F8;
  --border-radius: 14px;
  --padding-start: 5%;
  --padding-end: 5%;
  --padding-top: 2.5%;
  --padding-bottom: 2.5%;
  margin: 3% 0 3% 0;
}

.selected-option{
  --background: #13BD7E ;
  .option-text{
    color: #ffffff;
  }
}

.option-text {
  color: #333D4B;
  line-height: 1.25;
  font-size: 1rem;
  font-weight: bold;
}


ion-footer{
  height: 15%;
}

.prev-button, .next-button {
  --border-radius: 16px;
  --border-color: transparent;
  line-height: 1.25;
  font-size:1rem;
  font-weight: 600;
  --padding-start: 5vw;
  --padding-end: 5vw;
  --padding-top: 2vh;
  --padding-bottom: 2vh;
}

.prev-button{
  color:#FFF;
  --background: #333D4B;
}

.next-button{
  --background: #13BD7E;
}

.next-button:disabled{
  --background:#BBE5A6 ;
}


/* Media Query for Small Devices (e.g., Galaxy S8) */
@media(max-width: 360px) {

  .option-item {
    --padding-start: 3%; /* Reduce padding inside the options */
    --padding-end: 3%;
    --padding-top: 1.5%;
    --padding-bottom: 1.5%;
  }

  .question-title {
    font-size: 1.5rem; /* Reduce font size for the question */
  }



  .question-container {
    margin-top: 3%; /* Reduce top margin for question container */
  }


  /* Reduce chat bubble margin */
  .chat-bubble {
    margin-top: 10%;
  }
}

@media(max-width: 345px){

  .chat-bubble {
    margin-top: 30%;
  }

}

</style>