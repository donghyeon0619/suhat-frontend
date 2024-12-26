<script setup lang="ts">
import {IonPage, IonContent, IonText, IonImg, IonFooter, useIonRouter} from "@ionic/vue"
import Header from "@/components/common/BackButtonHeader.vue";
import ChatBubble from "@/components/common/ChatBubble.vue";
import BaseButton from "@/components/common/BaseButton.vue";
import {ref, watch} from "vue";

const currentScreen = ref(1);
const isDimmed = ref(false);
const isButtonActive = ref(false);
const messageText = ref('카드를 선택해서 우리 함께 보드 게임을<br>하는 방법을 배워보자!');

watch(currentScreen, (newVal) => {
  if (newVal === 2) {
    setTimeout(() => {
      isDimmed.value = true;
      isButtonActive.value = true;
    }, 3000);
  }
});

const router = useIonRouter();

const handleButtonClick = () => {
  isDimmed.value = false;

  if(currentScreen.value === 2) {
    currentScreen.value += 1;
  } else {
    router.push({
      path: "/game/home"
    });
  }

  messageText.value = '많은 동의를 얻어 퍼즐 조각을 획득해보자<br>가장 많은 퍼즐 조각을 얻은 사람이 승자야!'
};
</script>

<template>
  <IonPage>
    <Header :class="{ dimmed: isDimmed }"></Header>
    <ion-content
        class="ion-padding"
        :class="{ dimmed: isDimmed }"
        scroll-y="false">
      <div class="tutorial-title">
        <ion-text>보드게임 배우기</ion-text>
      </div>

      <!-- tutorial 1 -->
      <div v-if="currentScreen === 1">
        <div class="tutorial-description ion-margin-top ion-margin-bottom">
          <ion-text>그림 카드를<br>확인 해보세요!</ion-text>
        </div>
        <ion-img
            @click="currentScreen = 2"
            class="example-img-card"
            src="src/assets/img/game/tutorial/example-card.svg">
        </ion-img>
      </div>

      <!-- tutorial 2 -->
      <div v-else-if="currentScreen === 2">
        <div class="tutorial-description ion-margin-top ion-margin-bottom">
          <ion-text>예시 답안을<br>확인해요</ion-text>
        </div>
        <ion-img
            class="example-img-card"
            src="src/assets/img/game/tutorial/example-answer.svg">
        </ion-img>
      </div>

      <!-- tutorial 3 -->
      <div v-else-if="currentScreen === 3">
        <div class="tutorial-description ion-margin-top ion-margin-bottom">
          <ion-text>이야기를 들은<br>당신의 생각은?</ion-text>
        </div>
        <ion-img
            class="example-img-card"
            src="src/assets/img/game/tutorial/example-vote.svg">
        </ion-img>
      </div>
    </ion-content>
    <ion-footer class="ion-padding" :class="{ dimmed: isDimmed }">
      <chat-bubble class="ion-margin-bottom" :message="messageText" :has-tail="false">
      </chat-bubble>
      <BaseButton
          v-if="isButtonActive"
          button-text="알았어!"
          @click="handleButtonClick">
      </BaseButton>
    </ion-footer>
  </IonPage>
</template>

<style scoped>
.ion-page {
  background-image: url("../../../assets/img/typetest/bg-type-test-page-dark.png");
  background-position: center;
  background-size: cover;
}

ion-content::part(background) {
  background: transparent;
}

::v-deep ion-toolbar {
  --background: transparent;
}

::v-deep ion-back-button::part(icon) {
  color: white;
}

.tutorial-title {
  display: flex;
  justify-content: center;
  color: #13BD7E;
  font-weight: bold;
}

.tutorial-description {
  display: flex;
  justify-content: center;
  text-align: center;
  color: white;
  font-weight: bold;
  font-size: 2.8vh;
  margin-bottom: 30px;
}

.example-img-card {
  height: 45vh;
}

ion-content.dimmed::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 10;
  pointer-events: none;
}

.dimmed {
  background-color: rgba(0, 0, 0, 0.6);
}

</style>