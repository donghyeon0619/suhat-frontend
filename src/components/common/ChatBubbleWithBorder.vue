<script setup lang="ts">
import{
  IonLabel,
} from "@ionic/vue";
import SuhatChip from "@/components/common/SuhatChip.vue";

const props = defineProps({
  message : {
    type:String,
    required: true,
  },
  customRadius:{
    type:String,
    default: '16px'
  },
  hasTail:{
    type: Boolean,
    default: true
  },
  textAlign:{
    type:String,
    default: "start",
  },
  showChip:{
    type: Boolean,
    default: true
  },
  bubbleFontSize:{
    type: String,
    default: "1.125rem"
  }
})

</script>

<template>
  <div class="chat-wrapper">
    <!-- 말풍선 -->
    <div
      class="speech-bubble"
      :class="{ 'no-tail': !hasTail}"
      :style="{ borderRadius: customRadius, textAlign: textAlign }"
    >
      <IonLabel v-html="message" :style="bubbleFontSize"></IonLabel>
    </div>
    <SuhatChip v-if="showChip"/>
  </div>
</template>

<style scoped>
.suhat-chip{
  position: absolute;
  top: -3vh;
  z-index: 2;
}

.chat-wrapper{
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width:100%;
}

.speech-bubble{
  position: relative;
  background: rgba(255, 255, 255, 0.8);
  border: 4px solid #ffffff;
  padding: 2.3vh 2vh;
  width: 100%;
  ion-label{
    font-weight: 700;
    font-size: 1.125rem;
    line-height: 1.5;
    color: #333D4B;
  }
  z-index: 2;
}

/* Tail Creation */
.speech-bubble::after,
.speech-bubble::before {
  content: '';
  position: absolute;
  bottom: 0; /* Position based on tail height */
  left: 15%; /* Adjust left position as needed */
  width: 0;
  height: 0;
}


/* 꼬리 만들기 - 기본적으로 활성화됨 */
.speech-bubble::after {
  border: 15px solid transparent;
  border-top-color: #D9D9D9;
  border-bottom: 0;
  margin-left: -4vw;
  margin-bottom: -1.5vh;
  z-index:2;
}


.speech-bubble::before {
  border: 17px solid transparent;
  border-top-color: #ffffff;
  border-bottom: 0;
  margin-left: -4.7vw;
  margin-bottom: -2.1vh;
}



/* 꼬리를 비활성화하는 경우, content 값을 none으로 설정 */
.speech-bubble.no-tail::after, .speech-bubble.no-tail::before {
  content: none;
}

/* Media Query for Small Devices (e.g., Galaxy S8) */
@media(max-width: 360px){
  .speech-bubble{
    padding: 1.8vh 1.5vh;

  }

  /* 꼬리 만들기 - 기본적으로 활성화됨 */
  .speech-bubble::after {
    margin-left: -4vw;
    margin-bottom: -1.6vh;
  }


  .speech-bubble::before {
    margin-left: -4.7vw;
    margin-bottom: -2.3vh;
  }
}

/* Media Query for Foldable Devices (e.g., Galaxy Z Fold) */
@media  (max-width: 345px) {
}

</style>