<script setup>
import { IonChip, IonAvatar, IonImg } from "@ionic/vue";
import SuhatImg from "@/assets/img/suhat_smal.svg";

const props = defineProps({
  label: {
    type: String,
    default: '햇냥이', // 기본 텍스트
  },
  avatarImage: {
    type: String,
    default: SuhatImg, // 기본 이미지 (햇냥이)
  },
  fontSize:{
    type:String,
    default: '1rem',  // 기본 글자 크기

  }
});
</script>

<template>
  <IonChip class="suhat-chip">
    <IonAvatar>
      <IonImg :src="avatarImage" />
    </IonAvatar>
    <ion-label class="chip-text" :style="{fontSize: fontSize}">{{ label }}</ion-label>
  </IonChip>
</template>


<style scoped>
.suhat-chip {
  --background: #13BD7E;
  border: 2px solid #09834C;
  --border-radius: 10px;
}

ion-avatar {
  background: white;
  border: 2px solid #09834C;
}

.chip-text {
  line-height: 1.25rem;
  font-family: "Haan Wing2";
  font-weight: 700;
  color: #ffffff;
}
</style>