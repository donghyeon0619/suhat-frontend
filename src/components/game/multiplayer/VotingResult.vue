<script setup lang="ts">
import FilledCheckmarkIcon from "@/components/common/FilledCheckmarkIcon.vue";
import FilledXIcon from "@/components/common/FilledXIcon.vue";
import {IonCol, IonLabel, IonRow, IonText} from "@ionic/vue";

// Props 정의
defineProps({
  agreeCounts: {
    type: Number,
    required: true,
  },
  disagreeCounts: {
    type: Number,
    required: true,
  },
});
</script>

<template>
  <IonRow class="vote-result ion-justify-content-between">
    <!-- 동의 -->
    <IonCol class="vote-item" size="5.5" >
      <div class="vote-content agree">
        <FilledCheckmarkIcon class="check-icon"/>
        <IonText class="agree-text">동의</IonText>
        <IonText class="divider">|</IonText>
        <IonLabel class="vote-count">{{agreeCounts}}표</IonLabel>
      </div>
    </IonCol>

    <!-- 비동의 -->
    <IonCol class="vote-item" size="6">
      <div class="vote-content disagree">
        <FilledXIcon class="x-icon"/>
        <IonText class="disagree-text">비동의</IonText>
        <IonText class="divider">|</IonText>
        <IonLabel class="vote-count">{{disagreeCounts}}표</IonLabel>
      </div>
    </IonCol>
  </IonRow>
</template>

<style scoped>
.vote-result {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin-top: 2vh;
}

.vote-item {
  width: 100%;
  background: #ffffff;
  border-radius: 16px;
  padding: 5%;

}

.vote-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.divider{
  color: #D9D9D9;
  font-size: 1rem;
  margin: 0 1.5vw;
}

.check-icon, .x-icon{
  margin-bottom: 2%;
}
.disagree-text, .agree-text{
  margin-left: 1vw;
}

.vote-count, .agree-text, .disagree-text{
  font-size: 1.125rem;
  line-height: 1.6;
  font-weight: 700;
  color:#333D4B;
}

/* Media Query for Foldable Devices (e.g., Galaxy Z Fold) */
@media  (max-width: 345px) {
  .divider{
    margin: 0 1vw;
  }
}

</style>