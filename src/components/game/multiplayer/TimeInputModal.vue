<script setup lang="ts">
import {
  IonContent,
  IonLabel,
  IonRange,
  modalController,
  IonRow,
  IonCol,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
} from "@ionic/vue";
import {computed, ref} from "vue";

const confirm = () => modalController.dismiss(usageTime.value, 'confirm');

// 스마트폰 이용시간 변수
const usageTime = ref(0);


const formattedUsageTime = ref('00시간 00분');

// range값 변수
const rangeValue = ref(0);

const rangeChange = ({detail}) => {
  rangeValue.value = detail.value;
  const maxTimeInMinutes = 16 * 60;
  usageTime.value = Math.round((rangeValue.value / 100) * maxTimeInMinutes);
  formattedUsageTime.value = calculateFormattedUsageTime(usageTime.value);
}

function calculateFormattedUsageTime(totalMinutes: number){
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  return `${hours.toString().padStart(2, '0')}시간 ${minutes.toString().padStart(2, '0')}분`;
}

const isRangeInput = computed(()=>
  usageTime.value !== undefined && usageTime.value !== 0
)

</script>

<template>
  <IonContent scroll-y="false">
    <div class="usage-time-modal-container">
      <div class="speech-bubble-wrapper">
        <div class="speech-bubble">
          <IonLabel>(설정- 디지털 웰빙 및 자녀 보호기능)에서 확인가능!</IonLabel>
        </div>
      </div>
      <IonCard class="modal-card ion-padding">
        <div class="modal-handle"></div>
        <IonCardHeader class="modal-header">라운드 1</IonCardHeader>
        <IonCardContent class="modal-content">
          <h2 class="modal-title">하루 평균 스마트폰<br>이용시간을 알려주세요</h2>
          <div class="usage-time-wrapper">
            <p class="usage-time-title">내 스마트폰 이용시간</p>
            <IonLabel class="usage-time">
              {{formattedUsageTime}}
            </IonLabel>
            <IonRange min="0" max="100" :value="rangeValue" @ionChange="rangeChange"></IonRange>
          </div>
        </IonCardContent>
        <IonRow class="card-footer">
          <IonCol style="padding:0">
            <IonButton
                expand="block"
                @click="confirm"
                :disabled="!isRangeInput"
              >
                입력완료
            </IonButton>
          </IonCol>
        </IonRow>
      </IonCard>
    </div>
  </IonContent>
</template>
<style scoped>
ion-content::part(background) {
  background: transparent;
}

.usage-time-modal-container{
  position: absolute;
  bottom: 0;
  width: 100%;
}

.speech-bubble-wrapper{
  width: 85%;
  margin:  2vh auto;
  background: transparent;
}

.speech-bubble{
  position: relative;
  background: #13BD7E;
  border-radius: 16px;
  padding: 0.8vh 1.5vh;
  width: fit-content;
  ion-label{
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 2;
    color: white;
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
  border-top-color: #13BD7E;
  border-bottom: 0;
  margin-left: -4vw;
  margin-bottom: -1.3vh;
}

.modal-card{
  margin: 0;
  border-top-right-radius: 24px;
  border-top-left-radius: 24px;
  display: flex;
  flex-direction: column;
}

.modal-handle{
  width: 36px;
  height: 5px;
  background-color: #DCE2E8;
  border-radius: 8px;
  margin: auto;
  cursor: pointer;
}

.modal-header{
  font-weight: bold;
  font-size: 1rem;
  line-height: 1.75;
  color:#6B7684;
  text-align: center;
}

.modal-title{
  font-size: 1.375rem;
  line-height: 1.45;
  font-weight: bold;
  color:#000000;
  margin-bottom: 15%;
}

.modal-content{
  flex-grow: 1;
  overflow-y: auto;
}

.usage-time-wrapper{
  display: flex;
  flex-direction: column;
  text-align: center;

}
.usage-time-title{
  color: #6B7684;
  line-height: 1.25;
  font-weight: 600;
  margin-bottom: 10%;
}

.usage-time{
  color: #191F28;
  font-size: 2rem;
  line-height: 1;
  font-weight: bold;
  margin-bottom: 8%;
}

ion-range {
  --bar-background: #F0F2F4;
  --bar-background-active: #13BD7E;
  --bar-height: 10px;
  --bar-border-radius: 8px;
  --knob-background: #ffffff;
  --knob-size: 50px;
  --knob-border-radius: 18px;
  margin-bottom: 8%;
  --knob-box-shadow: 0px 4px 14px rgba(192, 192, 192, 0.2);
}

ion-range::part(knob) {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="24" viewBox="0 0 32 24" fill="none" stroke="%2399989D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="10 15 5 12 10 9"></polyline><polyline points="22 9 27 12 22 15"></polyline></svg>');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 80%; /* Adjust size to provide visual space */
  border: 1px solid #F0F2F4;
}

.card-footer {
  width: 100%;
  background: white;
  height: 12vh;
}

.card-footer ion-button {
  --background: #13BD7E;
  --border-radius: 16px;
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.25rem;
  --padding-top: 2vh;
  --padding-bottom: 2vh;
}


/* Media Query for Small Devices (e.g., Galaxy S8) */
@media(max-width: 360px) {
  .speech-bubble::after {
    margin-left: -4vw;
    margin-bottom: -1.4vh;
  }
}

/* Media Query for Foldable Devices (e.g., Galaxy Z Fold) */
@media  (max-width: 345px) {
}

</style>