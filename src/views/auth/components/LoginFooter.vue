<script setup lang="ts">

import {IonFooter} from "@ionic/vue";

const props= defineProps({
  isButtonDisabled:{
    type: Boolean,
    default: true
  },
  buttonText:{
    type:String,
    default: '다음'
  },
  onConfirm:{
    type: Function,
    required: true
  }
})
</script>

<template>
  <IonFooter class="ion-no-border">
    <div class="action-button">
      <ion-button expand="block" :disabled="isButtonDisabled" @click="props.onConfirm">{{buttonText}}</ion-button>
    </div>
  </IonFooter>

</template>

<style scoped>
ion-footer{
  height: 15%;
}

.action-button{
  margin: 1vh 2vh 1vh 2vh;
}

ion-button {
  --border-radius: 12px;
  --background: #13BD7E;
  font-size:16px;
  --padding-top: 2vh;
  --padding-bottom: 2vh;
}

</style>