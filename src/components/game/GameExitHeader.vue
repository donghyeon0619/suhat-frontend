<script setup lang="ts">
import {IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonIcon} from "@ionic/vue";
import {chevronBack} from 'ionicons/icons';

// Define a prop for the color
const props = defineProps({
  headerTitle: {
    type: String,
    default: '게임'
  },
});

const emit = defineEmits(['buttonClick']);

const handleButtonClick = () => {
  emit('buttonClick');
}

</script>

<template>
  <ion-header class="ion-no-border">
    <ion-toolbar>
      <ion-buttons>
        <ion-button class="exit-button" @click="handleButtonClick">
          <ion-icon slot="icon-only" :icon="chevronBack"></ion-icon>
        </ion-button>
      </ion-buttons>
      <IonTitle class="page-title">{{headerTitle}}</IonTitle>
    </ion-toolbar>
  </ion-header>
</template>

<style scoped>
ion-toolbar{
  --background: transparent;
  position: relative;
}

.page-title{
  color: #333D4B;
  position: absolute;
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.25;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

ion-buttons{
  margin-left: 0;
}
.exit-button{
  --padding-start: 0 !important;
}
</style>