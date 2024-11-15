<script setup lang="ts">
import {IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle} from "@ionic/vue";
import { chevronBackOutline } from 'ionicons/icons';
import {computed} from "vue";
// Define a prop for the color
const props = defineProps({
  backButtonColor: {
    type: String,
    default: null, // Default to null if no color is specified
  },
  headerTitle: {
    type: String,
    default: '게임'
  },
  showTitle: {
    type: Boolean,
    default: false,
  }
});

// Set the color only if it's "white", otherwise leave it as the default
const buttonColor = computed(() => (props.backButtonColor === "white" ? "light" : undefined));

</script>

<template>
<ion-header class="ion-no-border">
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-back-button :color="buttonColor" :icon="chevronBackOutline" default-href="/" />
    </ion-buttons>
    <IonTitle v-if="showTitle" class="page-title">{{headerTitle}}</IonTitle>
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
ion-back-button{
  --padding-start: 0;
}
</style>