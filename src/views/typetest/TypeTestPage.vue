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
  IonFooter, useIonRouter, onIonViewWillEnter, alertController,
} from "@ionic/vue";
import {computed, ref, reactive, watch} from "vue";
import { chevronBackOutline} from "ionicons/icons";
import {useRoute} from "vue-router";
import {post} from "@/api/httpService";
import {useTypeTestStore} from "@/store/typeTest";
import SpeechBubbleimg  from "@/assets/img/typetest/img-typetest-speech-bubble.svg"

const router = useIonRouter();
const route = useRoute();
const typeTestStore = useTypeTestStore();
const serviceType= route.query;

const questions = computed(() => typeTestStore.questionData[typeTestStore.currentServiceTypeId] || []);

// 현재 질문 번호
const currentQuestionIndex = ref(0);

// 선택된 답변들 저장
const selectedAnswers = reactive<{ id: number; score: number }[]>(
  Array.from({ length: questions.value.length }, () => ({ id: -1, score: -1 }))
);

/**
 * 질문지 변경 시 selectedAnswers 초기화
 */
watch(questions, (newQuestions) =>{
  selectedAnswers.splice(
    0,
    selectedAnswers.length,
    ...Array.from({length: newQuestions.length}, () => ({ id: -1, score: -1}))
  );
})

/**
 * 보기 선택됬는지 computed
 */
const isOptionSelected = computed(() =>
  selectedAnswers[currentQuestionIndex.value]?.id !== undefined &&
  selectedAnswers[currentQuestionIndex.value]?.id !== -1
);

/**
 * 첫번째 질문인지 computed
 */
const isFirstQuestion = computed(() => {
  return currentQuestionIndex.value === 0;
})


/**
 * 선택 로직: 선택된 옵션의 id와 score 저장
 */
const selectOption = (id: number, score: number) => {
  const currentAnswer = selectedAnswers[currentQuestionIndex.value];
  if (currentAnswer.id === id) {
    // 동일한 옵션을 다시 선택하면 선택 취소
    currentAnswer.id = -1;
    currentAnswer.score = -1;
  } else {
    // 새로운 옵션 선택
    currentAnswer.id = id;
    currentAnswer.score = score;
  }
};

/**
 * 총 점수 계산 computed
 */
const totalScore = computed(() =>
  selectedAnswers.reduce((sum, answer) => (answer.score !== -1 ? sum + answer.score : sum), 0)
);

/**
 * 페이지 로드시 초기화
 */
onIonViewWillEnter(async ()=>{
  const serviceTypeId = Number(serviceType.id);
  const serviceTypeName = serviceType.name as string;

  typeTestStore.setCurrentServiceType(serviceTypeId, serviceTypeName);

  try {
    await typeTestStore.fetchQuestions(serviceTypeId);
    currentQuestionIndex.value = 0; // 질문 번호 초기화
    selectedAnswers.splice(
      0,
      selectedAnswers.length,
      ...Array.from({ length: questions.value.length }, () => ({ id: -1, score: -1 }))
    );
  } catch (error) {
    console.error("질문 데이터를 가져오는데 실패했습니다:", error);
  }
})


/**
 * 이전 문제 버튼 클릭 핸들러
 */
const goToPreviousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  }
};

/**
 * 다음 문제 버튼 클릭 핸들러
 */
const goToNextQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++;
  }
};

/**
 * 제출하기 버튼 클릭 핸들러
 */
const submitSurvey = async () =>  {
  try{
    // 1. 제출 데이터 구성
    const requestData = {
      serviceTypeId: Number(serviceType.id),
      totalScore:totalScore.value,
      selectedOptionIds: selectedAnswers.map(option => option.id ),
    }
    console.log("제출 데이터 ", requestData)
    // 2. 서버에 제출
    const response = await post("test-results", requestData);

    console.log(" 응답 데이터: ", response);

    // 제출 처리 후 결과 페이지로 이동
    router.replace({
      name: "TypeTestResult",
      query: {
        ...response,
        totalScore: totalScore.value,

      }
    });
  } catch (error) {
    await presentAlert("제출 실패", "결과를 제출하는 중 오류가 발생하였습니다. 다시 시도해주세요" )
  }
};

/**
 *
 * @param header
 * @param message
 */
const presentAlert = async (header: string, message: string) => {
  const alert = await alertController.create({
    header: header,
    message: message,
    buttons: ['확인'],
  });

  await alert.present();
};

</script>

<template>
  <IonPage>
    <IonHeader class="ion-no-border">
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton :icon="chevronBackOutline" default-href="/"></IonBackButton>
        </IonButtons>
        <IonTitle class="page-title">{{serviceType.name}} 유형검사</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent v-if="questions.length > 0" class="ion-padding" scroll-y="false">
      <!-- 질문 영역 -->
      <div class="question-container">
        <IonText class="question-number">
          <IonLabel style="color: #13BD7E">{{currentQuestionIndex + 1}}</IonLabel>/15
        </IonText>
        <IonLabel class="question-title">{{ questions[currentQuestionIndex].content}}</IonLabel>
      </div>

      <div class="option-container">
        <img class="chat-bubble" :src="SpeechBubbleimg" alt="말풍선 이미지" style="width: 65%"/>
        <!-- 선택지 -->
        <IonCard>
          <IonCardContent>
            <IonList lines="none" class="option-list">
              <IonItem
                  v-for="option in questions[currentQuestionIndex]?.testOptions || []"
                  :key="option.id"
                  class="option-item"
                  :class="{ 'selected-option' : selectedAnswers[currentQuestionIndex]?.id === option.id}"
                  @click="selectOption(option.id, option.score)"
              >
                <ion-label class="option-text">{{option.content}}</ion-label>
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
                :disabled="isFirstQuestion"
                @click="goToPreviousQuestion">이전 문제</ion-button>
          </ion-col>
          <ion-col size="7">
            <ion-button
                expand="block"
                class="next-button"
                :disabled="!isOptionSelected"
                @click="currentQuestionIndex === questions.length - 1 ? submitSurvey() : goToNextQuestion()"
            >
              {{ currentQuestionIndex === questions.length - 1 ? "제출하기" : "선택완료" }}
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

.chat-bubble{
  display: flex;
}

.option-container{
  position: absolute;
  width: 90%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 3vh;
}

ion-card{
  width: 100%;
  border: 3px solid #F2F2F2;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: none;
  margin: 2% 0 5% 0;
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
  height: 13%;
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



</style>