<script setup lang="ts">
import { IonButton } from '@ionic/vue';

const props = defineProps({
  isButtonDisabled:{
    type: Boolean,
    default: false
  },
  buttonText:{
    type:String,
    default: '다음'
  }
})
</script>

<template>
  <ion-button :disabled="isButtonDisabled" expand="block">{{ buttonText }}</ion-button>
</template>

<style scoped>
ion-button {
  width: 100%;
  margin: auto;
  --background: #13BD7E;
  --border-radius: 16px;
  font-size:16px;
  font-weight: bold;
  --padding-top: 18px;
  --padding-bottom: 18px;
  --box-shadow: 0px;
}

ion-button[disabled] {
  --background: #BBE5A6;
  opacity: 1;
}
</style>