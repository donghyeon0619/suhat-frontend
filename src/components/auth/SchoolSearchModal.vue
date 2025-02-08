<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonSearchbar,
  IonItem,
  modalController,
  IonIcon,
  IonItemGroup,
  IonBadge,
  IonLabel,
  IonItemDivider,
} from '@ionic/vue';
import {onMounted, onUnmounted, ref} from 'vue';
import {closeOutline,checkmarkCircle,searchOutline} from "ionicons/icons";
import {get} from "@/api/httpService";
import {Keyboard, KeyboardInfo} from "@capacitor/keyboard";
const schoolName = ref();
const schoolSearchResults = ref<SchoolDetails[]>([]);
const isSearchEmpty = ref(false);
const isSearchPerformed = ref(false);

// 학교 검색 결과 타입 정의
interface SchoolDetails {
  id: number;
  name: string;
  roadAddress: string;
  districtAddress: string;
}


const cancel = () => modalController.dismiss(null, 'cancel');
const confirm = () => modalController.dismiss(schoolName.value, 'confirm');

// confirmSchool 함수 추가
const confirmSchool = (name: string) => {
  schoolName.value = name; // 클릭한 학교 이름을 schoolName에 설정
  confirm(); // confirm 함수 호출하여 모달 닫기
};

const onFocus = (event) =>{
  event.target.style.borderColor = '#191F28';
}
const onBlur = (event) =>{
  event.target.style.borderColor = '#EBECEE';
}

// districtAddress에서 특정 키워드 이후의 부분만 남기는 함수
function formatDistrictAddress(districtAddress) {
  // 구 단어를 기준으로 자르기 위한 키워드 설정
  const keyword = "구";
  const keywordIndex = districtAddress.indexOf(keyword);

  // 키워드가 발견되면 해당 키워드 이후의 문자열을 반환
  if (keywordIndex !== -1) {
    return districtAddress.substring(keywordIndex + 1).trim();
  }

  // 키워드가 없으면 원래 districtAddress를 반환
  return districtAddress;
}

// 학교 검색 api 함수
const fetchSearchResults = async (query : string) => {
  try {
    const endpoint = 'schools';
    const params = {query}
    const response = await get(endpoint, params);

    // 응답 데이터에서 districtAddress만 포맷팅
    const formattedResults = response.map(item => ({
      ...item,
      districtAddress: formatDistrictAddress(item.districtAddress)
    }));
    return formattedResults || [];
  } catch (error) {
    console.error('검색 결과 오류', error);
    return [];
  }
};

// 입력 핸들러 = 검색어가 입력될 떄 호출
const handleInput = async (event : CustomEvent) =>{
  const query = event.detail.value;
  if(query){
    isSearchPerformed.value = true;
    const results = await fetchSearchResults(query);
    schoolSearchResults.value = results;
    isSearchEmpty.value = results.length == 0;
  } else {
    clearSearch();
  }
}

/**
 * 키보드 이벤트 리스너를 통해서 ion-searchbar 클릭시 content-area가 올라오는 현상 수정
 */
const keyboardWillShowListener = ref<any>(null);
const keyboardDidHideListener = ref<any>(null);

onMounted(() => {
  keyboardWillShowListener.value = Keyboard.addListener('keyboardWillShow', (info: KeyboardInfo) =>{
    // .content-area 요소를 선택한다.
    const contentArea = document.querySelector('#content-area') as HTMLElement;
    if (contentArea) {
      // 키보드 높이 만큼 margin-top 적용 (필요에 따라 추가 offset 조정 가능)
      contentArea.style.marginTop = `5%`;
    }
  });

  keyboardDidHideListener.value = Keyboard.addListener('keyboardDidHide', () => {
    const contentArea = document.querySelector('#content-area') as HTMLElement;
    if (contentArea) {
      contentArea.style.marginTop = `0%`;
    }
  });
})

onUnmounted(() => {
  if (keyboardWillShowListener.value) {
    keyboardWillShowListener.value.remove();
    keyboardWillShowListener.value = null;
  }
  if (keyboardDidHideListener.value) {
    keyboardDidHideListener.value.remove();
    keyboardDidHideListener.value = null;
  }
})

// 검색어가 없는 경우 초기화 함수
const clearSearch = () =>{
  isSearchPerformed.value = false;
  isSearchEmpty.value = false;
  schoolSearchResults.value = [];
}

</script>

<template>
  <ion-header class="ion-no-border">
    <ion-toolbar >
      <ion-buttons slot="start">
        <ion-button @click="cancel"><ion-icon aria-hidden="true" :icon="closeOutline" size="large"  /></ion-button>
      </ion-buttons>
      <ion-title >주소 검색</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <!-- 검색바 부분-->
    <div class="searchbar-container">
      <ion-searchbar
        placeholder="학교 이름, 지번 또는 도로명 검색"
        show-cancel-button="never"
        show-clear-button="focus"
        :debounce="1000"
        @ionInput="handleInput($event)"
        @ionFocus="onFocus"
        @ionBlur="onBlur"
        class="custom-searchbar"></ion-searchbar>
    </div>

    <!--컨텐츠 출력 부분 -->
    <div class="content-area" id="content-area">
      <!-- 예시 리스트 -->
      <div v-if="!isSearchPerformed" class="example-container">
        <ion-list lines="none">
          <ion-item class="example-title">
            <ion-label>
              <ion-icon class="check-icon" :icon="checkmarkCircle"></ion-icon>
              <ion-text><strong>이렇게 검색해보세요</strong></ion-text>
            </ion-label>
          </ion-item>
          <ion-item class="example-item">
            <ion-label>
              <ion-text>학교 이름</ion-text>
              <p>예) 서초초등학교, 서초중학교</p>
            </ion-label>
          </ion-item>
          <ion-item class="example-item">
            <ion-label>
              <ion-text>지번 주소</ion-text>
              <p>예) 서초동 1310-6</p>
            </ion-label>
          </ion-item>
          <ion-item class="example-item">
            <ion-label>
              <ion-text>도로명 주소</ion-text>
              <p>예) 서울 서초구 서초로 178</p>
            </ion-label>
          </ion-item>
        </ion-list>
      </div>


      <!-- 검색 결과 없음 -->
      <div v-if="isSearchPerformed && isSearchEmpty" class="no-results-container">
        <ion-icon :icon="searchOutline"></ion-icon>
        <ion-text class="empty-title">
          <h2>검색 결과가 없어요.</h2>
          <ion-text class="empty-subtitle">
            올바른 주소를 입력하셨는지 확인해보세요.
          </ion-text>
        </ion-text>
      </div>

      <!-- 검색 결과 리스트 -->
      <div v-if="isSearchPerformed && !isSearchEmpty" class="results-container">
        <ion-list lines="none">
          <ion-item-group v-for="(school,index) in schoolSearchResults" :key="index" @click="confirmSchool(school.name)" >
            <ion-item-divider>
              <ion-label>{{school.name}}</ion-label>
            </ion-item-divider>
            <ion-item class="results-item-detail">
              <ion-badge slot="start">도로명</ion-badge>
              <ion-label>{{school.roadAddress}}</ion-label>
            </ion-item>
            <ion-item class="results-item-detail">
              <ion-badge slot="start">구주소</ion-badge>
              <ion-label>{{school.districtAddress}}</ion-label>
            </ion-item>
          </ion-item-group>
        </ion-list>
      </div>
    </div>
  </ion-content>
</template>

<style scoped>
ion-title {
  font-weight: bold;
  font-size: 1.125rem;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

ion-toolbar {
  position: relative;
}

ion-button{
  --padding-start:0 ;
}

.searchbar-container {
  height: 13%;
  display: flex;
  align-items: center;
}

.custom-searchbar{
  --placeholder-color: #A3A9B0;
  --color:#191F28;
  --icon-color:#191F28;
  --box-shadow: none; /* 그림자를 제거 */
  padding: 1vh;
  border: 1.4px solid #EBECEE;
  border-radius: 12px;
}

.check-icon{
  font-size: 1rem;
  color: #13BD7E;
}

.example-item {
  color: #13BD7E;
  font-size: 0.875rem;
  ion-text{
    color: #13BD7E;
    font-weight :1000;
  }
  p{
    color: #6B7684;
  }
}

.example-title ion-text{
  font-size: 1rem;
  margin-left: 0.8vh;
  color: #191F28;
}

.no-results-container{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 50vh;
  text-align: center;
}

.no-results-container ion-icon {
  font-size: 4rem;
  color: #A3A9B0;
  margin-bottom: 2vh;
}

.empty-title h2 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #404040;
  line-height: 1.5;
  margin-bottom: 1vh;
}

.empty-subtitle {
  font-size: 0.875rem;
  color: #6B7684;
  line-height: 1.43;
  font-weight: 500;
}

.content-area ion-list{
  padding-top: 0;
}

ion-item-group{
  border-bottom: 1px solid #EBECEE;
  padding-bottom: 1.2vh ;
  margin-bottom: 0.5vh;
}

ion-badge{
  --background:#fff;
  border: 2px solid #EBECEE;
  --color: #A3A9B0 ;
  font-size:0.75rem;
  line-height: 1.5;
  font-weight: 500;
}

ion-item-divider{
  --background: #fff;
  --color: #404040;
  border-bottom-color: transparent;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5;
}

.results-item-detail{
  --min-height: 4vh;
}
.results-item-detail ion-label{
  font-size: 0.875rem;
  line-height: 1.43;
  color: #404040;
}

</style>