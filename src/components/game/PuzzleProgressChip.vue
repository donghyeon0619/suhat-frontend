<script setup lang="ts">
import {IonChip,IonThumbnail, IonLabel} from "@ionic/vue";
import PuzzlePieceIcon from "@/assets/icons/game/icon-puzzle-piece.svg"

const props = defineProps({
  currentPieces:{
    type:Number,
    required: true,
  },
  totalPieces:{
    type:Number,
    default:6
  }
})

</script>
<template>
 <IonChip class="puzzle-progress-chip">
   <IonThumbnail class="puzzle-icon">
     <img :src="PuzzlePieceIcon" alt="퍼즐 현황"/>
   </IonThumbnail>
   <IonLabel class="chip-text">퍼즐 조각 <span style="color:#737A83">{{currentPieces}}</span>/{{totalPieces}}개</IonLabel>
 </IonChip>
</template>

<style scoped>
.puzzle-progress-chip{
  justify-content: center;
  --color:transparent;
  --background: rgba(255,255,255,0.8);
  width: 55vw;
  height: 6vh;
  --border-color: red;
  border-radius: 26px;
}

.puzzle-icon{
  --size: 1.5rem;
  background: transparent;
  margin-right: 2vw;
}


.chip-text{
  color: #333D4B;
  font-size: 1.125rem;
  line-height: 1.25;
  font-weight: 600;
}
</style>