<script setup lang="ts">
import {IonFooter, IonButton} from "@ionic/vue";

// 버튼 속성 props 정의
const props = defineProps({
  isButtonDisabled:{
    type: Boolean,
    default: false,
  },
  buttonText:{
    type: String,
    default: '확인',
  },
  buttonColor:{
    type:String,
    default: '#13BD7E',
  }
})

// 버튼 이벤트 emit 정의
const emit = defineEmits(['buttonClick']);

const handleButtonClick = () =>{
  emit('buttonClick');
}

</script>
<template>
  <IonFooter class="ion-no-border">
    <div class="action-button">
      <IonButton
        expand="block"
        @click="handleButtonClick"
        :disabled="isButtonDisabled"
        :style="{'--background': buttonColor}">
      {{buttonText}}
      </IonButton>
    </div>
  </IonFooter>
</template>

<style scoped>
ion-footer {
  height: 15%;
}

.action-button {
  margin: 1vh 2vh;
}

ion-button {
  --border-radius: 16px;
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.25rem;
  --padding-top: 2vh;
  --padding-bottom: 2vh;
}
</style>