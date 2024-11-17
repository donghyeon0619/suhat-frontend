<script setup lang="ts">
import {IonContent, IonFooter, IonButton, modalController} from "@ionic/vue";
import ChatBubbleWithBorder from "@/components/common/ChatBubbleWithBorder.vue";
const cancel = () => modalController.dismiss(null, 'cancel');
</script>
<template>
  <IonContent>
    <div class="chat-bubble-wrapper">
      <ChatBubbleWithBorder
        message=
          "퍼즐조각 획득을 실패했어!
          <br>괜찮아! 다른 미션으로 다시 도전해보자">
      </ChatBubbleWithBorder>
    </div>
  </IonContent>
  <IonFooter class="ion-no-border">
    <div class="action-button">
      <IonButton expand="block" @click="cancel">알았어!</IonButton>
    </div>
  </IonFooter>
</template>

<style scoped>
ion-content::part(background) {
  background: transparent;
}

.chat-bubble-wrapper{
  position: absolute;
  bottom: 3%;
  left: 50%;
  transform: translateX(-50%);
  width: 91%;
}

ion-footer{
  height: 15%;
}

.action-button{
  margin: 1vh 2vh 1vh 2vh;
  ion-button {
    --border-radius: 16px;
    --background: #13BD7E;
    font-weight: 700;
    font-size:1rem;
    line-height: 1.25rem;
    --padding-top: 2vh;
    --padding-bottom: 2vh;
  }
}
</style>