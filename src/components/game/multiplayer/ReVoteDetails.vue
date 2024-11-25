<script setup lang="ts">
import {IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonLabel, IonText} from "@ionic/vue";
import FilledXIcon from "@/components/common/FilledXIcon.vue";

const props = defineProps({
  disagreeCounts: {
    type:Number,
    required: true,
  },
  disagreeUsers:{
    type: Array,
    required: true,
  }
})

</script>

<template>
  <IonCard class="re-vote-section ion-padding">
    <IonCardHeader class="re-vote-header">
      <IonCardTitle class="re-vote-title">
        <FilledXIcon/>
        <IonText class="disagree-text">비동의</IonText>
        <IonText class="divider">|</IonText>
        <IonLabel class="vote-count">{{disagreeCounts}}표</IonLabel>
      </IonCardTitle>
    </IonCardHeader>
    <IonCardContent class="re-vote-description">
      {{disagreeUsers.join(", ")}}이 비동의를 했어요.
    </IonCardContent>
  </IonCard>
</template>

<style scoped>
/* re-vote css 영역 */
.re-vote-section{
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  transform: translateX(-50%);
  left: 50%;
  margin: 2vh 0 0 0 ;
  border: 2px solid #C7E399;
  box-shadow: none;
}

.re-vote-header{
  padding: 0 0 1.5vh 0;
}

.re-vote-title{
  display: flex;
  align-items: center;
  .divider{
    color: #D9D9D9;
    font-size: 0.875rem;
    margin: 0 1vw;
  }
}
.disagree-text{
  margin-left: 1vw;
}

.re-vote-title ion-label, .re-vote-title ion-text {
  font-size: 1.125rem;
  line-height: 1.6;
  font-weight: 700;
  color:#333D4B;
}

.re-vote-description{
  background: #F0F2F4;
  border-radius: 12px;
  padding: 1.5vh 4vw;
  font-size: 0.8125rem;
  line-height: 1.85;
  font-weight: 600;
  color: #333D4B;
}


</style>