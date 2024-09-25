<script setup lang="ts">
import { IonHeader, IonToolbar, IonButtons, IonBackButton } from "@ionic/vue";
import { chevronBackOutline } from 'ionicons/icons';
</script>

<template>
<ion-header class="ion-no-border">
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-back-button :icon="chevronBackOutline"  default-href="/"></ion-back-button>
    </ion-buttons>  </ion-toolbar>
</ion-header>
</template>

<style scoped>

</style>