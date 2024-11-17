<script setup lang="ts">
import { IonHeader, IonToolbar, IonButtons, IonBackButton } from "@ionic/vue";
import { chevronBackOutline } from 'ionicons/icons';
import {computed} from "vue";
// Define a prop for the color
const props = defineProps({
  backButtonColor: {
    type: String,
    default: null, // Default to null if no color is specified
  },
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
  </ion-toolbar>
</ion-header>
</template>

<style scoped>
ion-toolbar{
  --background: transparent;
}

ion-buttons{
  margin-left: 0;
}
ion-back-button{
  --padding-start: 0;
}
</style>