<script setup lang="ts">
import {IonPage} from "@ionic/vue";
import BackButtonHeader from "@/components/common/BackButtonHeader.vue";
import GameRound0neView from "@/views/game/multiplayer/GameRound0neView.vue";
import {ref} from "vue";

const currentRound = ref(1);
</script>

<template>
  <IonPage>
    <BackButtonHeader id="backButtonHeader" header-title="라운드 1" show-title="true"/>
    <GameRound0neView/>
  </IonPage>
</template>

<style scoped>
.ion-page {
  background-image: url('../../../assets/img/typetest/bg-type-test-page.png'); /* 이미지를 직접 넣는 방법 */
}
</style>