<script setup lang="ts">
import {IonItem, IonImg, IonLabel, IonBadge, IonSpinner} from "@ionic/vue"

const props = defineProps({
  name: {
    type: String,
    default: '이름'
  },
  isUserJoined: {
    type: Boolean,
    default: false
  },
  isReady: {
    type: Boolean,
    default: false,

  }
})
</script>

<template>
  <ion-item :class="['item', { 'waiting-item': !isUserJoined }]">
    <template v-if="isUserJoined">
      <ion-img class="profile-icon" src="src/assets/icons/game/profile-icon.svg"></ion-img>
      <ion-label class="name">{{name}}</ion-label>
      <template v-if="isReady">
        <ion-badge class="ready-badge" slot="end">준비완료</ion-badge>
      </template>
      <template v-else>
        <ion-badge class="loading-badge" slot="end">
          <ion-spinner name="dots"></ion-spinner>
        </ion-badge>
      </template>
    </template>

    <template v-else>
      <ion-label class="waiting-text">입장 대기 중</ion-label>
      <ion-badge class="loading-badge" slot="end">
        <ion-spinner name="dots"></ion-spinner>
      </ion-badge>
    </template>
  </ion-item>
</template>

<style scoped>
.item {
  border: 1.9px solid #13BD7E;
  border-radius: 12px;
  height: max-content;
  margin: 1.6vh 0;
}

.waiting-item {
  border-color: #c0c0c0;
  --color: #A3A9B0;
}

.name {
  margin-left: 10px;
  font-size: 2.1vh;
}

.profile-icon {
  height: 4vh;
}

.ready-badge {
  --background: #13BD7E;
  padding: 8px;
  border-radius: 8px;
  font-weight: normal;
  font-size: 1.8vh;
}

.waiting-text {
  font-size: 2.15vh;
}

ion-spinner {
  --color: #737A83;
}

.loading-badge {
  --background: transparent;
  margin-right: 14px;
}
</style>