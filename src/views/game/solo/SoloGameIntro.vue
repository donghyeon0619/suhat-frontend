<script setup lang="ts">
import {IonPage, IonContent, IonButton, IonFooter, IonThumbnail, useIonRouter} from "@ionic/vue";
import Header from "@/components/common/BackButtonHeader.vue";
import ChatBubble from "@/components/common/ChatBubble.vue";
import OnboardImg from "@/assets/img/intro/onboard1.png"

const router = useIonRouter();

const goGameStart = () => {
  router.push("/sologame/play")
}

</script>

<template>
<IonPage>
  <Header></Header>
  <IonContent class="ion-padding" scroll-y="false">
    <div class="img-wrapper">
      <IonThumbnail style="--size:95%">
        <img :src="OnboardImg" class="onboard-img" alt="온보딩 이미지">
      </IonThumbnail>
    </div>
    <div class="chat-bubble-wrapper">
      <ChatBubble message="그림과 글자 카드가 서로 어떻게 <br>관련이 있는지 설명해줘" ></ChatBubble>
    </div>
  </IonContent>
  <IonFooter class="ion-no-border">
    <div class="action-button">
      <IonButton expand="block" @click="goGameStart">게임 시작</IonButton>
    </div>
  </IonFooter></IonPage>
</template>

<style scoped>
.ion-page {
  background: #ECEFF4;
}

ion-content::part(background) {
  background: transparent;
}

ion-footer{
  height: 15%;
}

.img-wrapper{
  margin-top: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-bubble-wrapper{
  position: absolute;
  bottom: 3%;
  left: 50%;
  transform: translateX(-50%);
  width: 91%;
}

.action-button{
  margin: 1vh 2vh 1vh 2vh;
  ion-button {
    --border-radius: 16px;
    --background: #333D4B;
    font-weight: 700;
    font-size:1rem;
    line-height: 1.25rem;
    --padding-top: 2vh;
    --padding-bottom: 2vh;
  }
}
</style>