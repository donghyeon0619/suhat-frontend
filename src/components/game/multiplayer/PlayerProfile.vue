<script setup lang="ts">
import {IonChip, IonLabel} from "@ionic/vue";

const props = defineProps({
  playerOrder :{
    type: Number,
    default: 1
  },
  playerName:{
    type: String,
    default: '홍길동',
  },
  pieceCount:{
    type: Number,
    default: 0
  },
  orderShow:{
    type:Boolean,
    default: true
  }
})

</script>

<template>
<div class="player-profile">
  <div class="chip-wrapper">
    <IonChip class="order-chip" v-if="orderShow">
      <IonLabel class="order">{{playerOrder}}</IonLabel>
    </IonChip>
    <IonChip class="player-chip">
      <IonLabel class="player-name">{{playerName}}</IonLabel>
    </IonChip>
  </div>
  <IonLabel class="player-status">
    <span style="color:#13BD7E">{{pieceCount}}</span>
    조각 보유 중
  </IonLabel>
</div>
</template>

<style scoped>
.player-profile{
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chip-wrapper{
  position: relative;
}

.order-chip{
  position: absolute;
  top: -20%;
  left: -15%;
  border-radius: 50%;
  --background: #09834C;
  z-index: 1;
}

.order{
  color:#ffffff;
  font-size: 1rem;
  font-weight: 800;
}

.player-chip{
  --background:#FFFFFF;
  --color: transparent;
  border: 2.4px solid #C7E399;
  border-radius: 12px;
  padding: 0.8vh 3.8vw;
}

.player-name{
  font-size: 1.125rem;
  line-height: 2;
  font-weight: Bold;
  color: black;
}

.player-status{
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
  color: #333D4B;
}

</style>