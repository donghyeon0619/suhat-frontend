<script setup lang="ts">

import {IonButton, IonFooter} from "@ionic/vue";
import {computed} from "vue";

const props = defineProps({
  isButton1Disabled: {
    type: Boolean,
    default: false
  },
  isButton2Disabled: {
    type: Boolean,
    default: false
  },
  buttonText1: {
    type: String,
    default: '비동의'
  },
  buttonText2: {
    type: String,
    default: '동의'
  },
  button1Color:{
    type:String,
    default: '#333D4B',
  },
  button2Color:{
    type:String,
    default: '#13BD7E',
  }
})

const emit = defineEmits(['button1Click', 'button2Click']);

const handleButton1Click = () => {
  emit('button1Click');
};

const handleButton2Click = () => {
  emit('button2Click');
};

// 버튼 비활성화, 활성화 computed
const button2Style = computed(() => ({
  '--background': props.isButton2Disabled ? '#BBE5A6' : props.button2Color, // Applies disabled color
}));
</script>

<template>
  <IonFooter class="ion-no-border">
    <div class="button-container">
      <ion-button
        class="small-button"
        :disabled="isButton1Disabled"
        expand="block"
        :style="{'--background': button1Color}"
        @click="handleButton1Click"
      >
        {{ buttonText1 }}
      </ion-button>
      <ion-button
        class="medium-button"
        :disabled="isButton2Disabled"
        expand="block"
        :style="button2Style"
        @click="handleButton2Click">
        {{ buttonText2 }}
      </ion-button>
    </div>
  </IonFooter>
</template>

<style scoped>

ion-footer{
  height: 15%;
  padding-top: 1vh;
}
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
}

.medium-button {
  width: 57%;
}

.medium-button[disabled] {
  --background: white;
  opacity: 1;
}


</style>