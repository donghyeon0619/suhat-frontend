<script setup lang="ts">

import {IonButton} from "@ionic/vue";

const props = defineProps({
  isButtonDisabled: {
    type: Boolean,
    default: true
  },
  buttonText1: {
    type: String,
    default: '비동의'
  },
  buttonText2: {
    type: String,
    default: '동의'
  }
})

const emit = defineEmits(['button1Click', 'button2Click']);

const handleButton1Click = () => {
  emit('button1Click');
};

const handleButton2Click = () => {
  emit('button2Click');
};
</script>

<template>
  <div class="button-container">
    <ion-button class="small-button" expand="block" @click="handleButton1Click">{{ buttonText1 }}</ion-button>
    <ion-button class="medium-button" :disabled="isButtonDisabled" expand="block" @click="handleButton2Click">{{ buttonText2 }}</ion-button>
  </div>
</template>

<style scoped>
.button-container {
  width: 90%;
  margin: auto;
}

ion-button {
  display: inline-block;
  margin: 0;
  --border-radius: 16px;
  font-size:16px;
  font-weight: bold;
  --padding-top: 18px;
  --padding-bottom: 18px;
  --box-shadow: 0px;
}

.small-button {
  width: 40%;
  margin-right: 3%;
  --background: #333D4B;
}

.medium-button {
  width: 57%;
  --background: #13BD7E;
}

.medium-button[disabled] {
  --background: #BBE5A6;
  opacity: 1;
}
</style>