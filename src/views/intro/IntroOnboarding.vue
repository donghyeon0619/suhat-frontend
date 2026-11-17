<script setup lang="ts">
import {IonPage, IonContent, IonText, IonImg, IonFooter, IonThumbnail, useIonRouter} from "@ionic/vue";
import { Swiper, SwiperSlide } from 'swiper/vue';
import onboardImage1 from '@/assets/img/intro/onboard1.png';
import onboardImage2 from '@/assets/img/intro/onboard2.png';
import onboardImage3 from '@/assets/img/intro/onboard3.png';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import {ref} from "vue";
import {useAppStateStore} from "@/store/appState";

/**
 * 온보딩 state 및 라우터 변수 선언
 */
const appStateStore = useAppStateStore();
const router = useIonRouter();

const isLoading = ref(false);

// 슬라이드 데이터 선언
const slides = ref([
  {
    image: onboardImage1,
    title: '두 카드 사이의 연결 고리 만들기',
    description: '어떤 그림 카드와 글자 카드가 나올까?'
  },
  {
    image: onboardImage2,
    title: '조각들이 합쳐지면 퍼즐 완성!',
    description: '퍼즐 조각을 모아볼까요?'
  },
  {
    image: onboardImage3,
    title: '재밌게 알아보는 이용습관 유형',
    description: '내 스마트폰 이용 유형은 뭘까?'
  }
]);

// Swiper 슬라이드 인덱스 관리
const activeSlide = ref(0);
const totalSlides = ref(slides.value.length); // 슬라이드 개수 설정

const onSlideChange = (swiper: { realIndex: number }) => {
  activeSlide.value = swiper.realIndex;
};

const completeOnboarding = async () => {
  if (isLoading.value) return; // 이미 진행 중이면 무시
  isLoading.value = true;

  appStateStore.markOnboardingComplete(); // 온보딩 완료
  router.replace('/home'); // 홈화면으로 이동
}
</script>

<template>
  <IonPage>
    <IonContent class="ion-padding" :scroll-y="false">
      <div class="swiper-container" style="height: 90%">
        <!-- Swiper 슬라이드 부분 -->
        <swiper
            :slidesPerView="1"
            :spaceBetween="30"
            :loop="false"
            @slideChange="onSlideChange"
        >
          <!-- v-for을 사용해 슬라이드 반복 생성 -->
          <swiper-slide v-for="(slide, index) in slides" :key="index">
            <div class="slide-content">
              <div class="img-wrapper">
                <ion-thumbnail>
                  <IonImg :src="slide.image" :alt="'Slide ' + (index + 1)" class="slide-img" />
                </ion-thumbnail>
              </div>
              <div class="text-wrapper">
                <IonText class="slide-description">{{ slide.description }}</IonText>
                <h2 class="slide-title">{{ slide.title }}</h2>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
      <!-- 커스텀 페이지네이션 -->
      <div class="custom-pagination">
            <span
                v-for="index in totalSlides"
                :key="index"
                :class="['pagination-dot', { 'active-dot': index - 1 === activeSlide }]"
            ></span>
      </div>
    </IonContent>
    <IonFooter class="ion-no-border" >
      <div class="action-button">
        <ion-button expand="block" @click="completeOnboarding">시작하기</ion-button>
      </div>
    </IonFooter>
  </IonPage>
</template>

<style scoped>

.ion-page {
  background: #F3F4F6;
}

ion-toolbar{
  --background: transparent;
}

ion-content::part(background) {
  background: transparent;
}

.slide-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

ion-thumbnail{
  --size: 100%
}

.img-wrapper {
  min-height: 42vh;
  margin-top: 5vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.text-wrapper {
  padding-top: 22%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.slide-title {
  font-size: 1.625rem;
  font-weight: 700;
  color: #191F28;
  margin-top:2.5vh;
  margin-bottom:2.5vh;
}

.slide-description {
  font-size: 1.125rem;
  font-weight: 600;
  color: #13BD7E;
}


.custom-pagination {
  display: flex;
  justify-content: center;
  margin-top:1vh;

}

.pagination-dot {
  width: 10px;
  height: 10px;
  margin: 0 5px;
  background-color: #ddd;
  border-radius: 50%;
  transition: width 0.3s ease, background-color 0.3s ease, border-radius 0.3s ease; /* 부드러운 전환 효과 */
}

.active-dot {
  background-color: #000000;
  width: 30px;
  height: 10px;
  border-radius: 16px; /* 타원형으로 만듦 */
  transition: width 0.3s ease, background-color 0.3s ease, border-radius 0.3s ease;

}

ion-footer{
  height: 13%;
}


.action-button{
  margin: 1vh 2vh 1vh 2vh;
}

ion-button {
  --border-radius: 16px;
  --background: #13BD7E;
  font-size:16px;
  --padding-top: 2vh;
  --padding-bottom: 2vh;
}

/* Media Query for Small Devices (e.g., Galaxy S8) */
@media(max-width: 360px){
  ion-thumbnail{
    --size: 90%;
  }
  .img-wrapper{
    min-height: 43vh;
  }
}

</style>