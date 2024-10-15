<script setup lang="ts">
import{
  IonLabel,
  IonChip,
  IonAvatar,
  IonImg,
} from "@ionic/vue";
import SuhatImg from "@/assets/img/suhat_smal.svg";
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
  }
})

</script>

<template>
  <div class="chat-wrapper">
    <!-- 말풍선 -->
    <div
        class="speech-bubble"
        :class="{ 'no-tail': !hasTail}"
        :style="{ borderRadius: customRadius }"
    >
      <IonLabel v-html="message"></IonLabel>
    </div>
    <SuhatChip/>
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
  margin-top: 10vh;
}

.speech-bubble{
  position: relative;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  padding: 2vh;
  ion-label{
    font-weight: 700;
    font-size: 1.125rem;
    line-height: 1.75;
  }
}

/* 꼬리 만들기 - 기본적으로 활성화됨 */
.speech-bubble::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 15%;
  width: 0;
  height: 0;
  border: 15px solid transparent;
  border-top-color: white;
  border-bottom: 0;
  margin-left: -15px;
  margin-bottom: -15px;
}

/* 꼬리를 비활성화하는 경우, content 값을 none으로 설정 */
.speech-bubble.no-tail::after {
  content: none;
}
</style>