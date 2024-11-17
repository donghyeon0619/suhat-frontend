<script setup lang="ts">
import {
  IonContent,
  IonPage,
  IonTitle,
  IonText,
  IonIcon,
  IonInput,
  IonModal,
  IonButton,
  modalController,
  IonLabel
} from "@ionic/vue"
import Header from "@/views/auth/components/LoginHeader.vue";
import { StreamBarcodeReader } from "vue-barcode-reader";
import BaseButton from "@/components/common/BaseButton.vue";
import axios from "axios";
import {ref} from "vue";
import router from "@/router";

const roomId = ref('');
const roomInfo = ref<{ roomName: string; headCount: number } | null>(null);

const findRoom = async () => {
  if (!roomId.value) {
    alert('바코드 번호를 입력해주세요.');
    return;
  }

  try {
    const response = await axios.get(`/games/${roomId.value}`);

    if (response.data) {
      roomInfo.value = {
        roomName: response.data.name,
        headCount: response.data.headCount,
      };

      closeModal();
    } else {
      alert('해당 게임방이 존재하지 않습니다.');
    }
  } catch (error) {
    console.error('게임방을 찾는 중 오류가 발생했습니다:', error);
    alert('게임방을 찾을 수 없습니다.');
  }
};

function closeModal() {
  modalController.dismiss();
}

function close() {
  router.push({
    path: "/game/home"
  });
}
</script>

<template>
  <IonPage>
    <Header></Header>
    <ion-content class=" background" scroll-y="false">
      <ion-title class="title">방 입장하기</ion-title>
      <ion-text class="description">아래 사각형 안에 바코드가<br>꽉차도록 맞춰주세요</ion-text>

      <div class="scanner-wrap">
        <StreamBarcodeReader
            @decode="onDecode"
            @loaded="onLoaded"
            :constraints="{ facingMode: 'environment' }"
            class="custom-scanner"
        />
      </div>

      <div class="information">
        <ion-text id="enter-room-id">
          <ion-icon src="src/assets/icons/game/informaion-icon.svg"></ion-icon>
          바코드가 인식되지 않나요?
        </ion-text>
      </div>

      <ion-icon class="cancel-icon" src="src/assets/icons/game/cancel-icon.svg" @click="close()"></ion-icon>
    </ion-content>
  </IonPage>

  <!-- 방 바코드 입력 모달 -->
  <ion-modal trigger="enter-room-id">
    <div class="block">
      <ion-title class="modal-title">방 입장하기</ion-title>

      <ion-text class="modal-sub-title">
        <ion-icon src="src/assets/icons/game/search-icon.svg"></ion-icon>
        방 바코드 번호
      </ion-text>
      <ion-input class="input" fill="outline" v-model="roomId"></ion-input>
      <BaseButton id="check-game-room" button-text="검색" @click="findRoom"></BaseButton>
      <div class="cancel-btn">
        <ion-button fill="clear" @click="closeModal">취소</ion-button>
      </div>
    </div>
  </ion-modal>

  <!-- 게임방 확인 모달 -->
  <ion-modal trigger="check-game-room">
    <div class="block">
      <ion-title class="modal-title">방 입장하기</ion-title>

      <ion-text class="modal-sub-title">
        <ion-icon src="src/assets/icons/game/tag-icon.svg"></ion-icon>
        방 이름
      </ion-text>
      <ion-input class="input" fill="outline" readonly>{{roomName}}</ion-input>

      <div class="horizontal-division">
        <ion-text>
          <ion-icon src="src/assets/icons/common/singleplay-icon.svg"></ion-icon>
          인원 수<span class="vertical-division"></span>
          <ion-label>{{headCount}}인 게임</ion-label>
        </ion-text>
      </div>
      <BaseButton button-text="입장하기" @click="findRoom"></BaseButton>
      <div class="cancel-btn">
        <ion-button fill="clear" @click="closeModal">취소</ion-button>
      </div>
    </div>
  </ion-modal>
</template>

<style scoped>
.background {
  --background: black;
  opacity: 0.8;
  --color: white;
  display: flex;
  text-align: center;
}

::v-deep ion-toolbar {
  --background: black;
  opacity: 0.8;
}

::v-deep ion-back-button::part(icon) {
  color: white;
}

.title {
  --color: #13BD7E;
  margin: 20px 0 30px 0;
}

.description {
  font-size: 2.6vh;
}

.custom-scanner {
  width: 100%;
  height: 100%;
}

.scanner-wrap {
  margin: 7vh 0 2.5vh 0;
  height: max-content;
}

.cancel-icon {
  position: absolute;
  bottom: 10%;
  font-size: 50px;
  transform: translateX(-50%);
  z-index: 2;
}

/* 전체 스캐너 컨테이너 스타일 */
.scanner-container.custom-scanner {
  padding: 0 20px;
  width: 100%;
  height: max-content;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 비디오 요소 스타일 (바코드를 스캔하는 카메라 화면) */
.custom-scanner :deep(video) {
  width: 100%;
  height: 100%;
  border-radius: 16px;
}

/* 오버레이 요소 스타일 (스캐너 화면 위의 반투명 레이어) */
.custom-scanner :deep(.overlay-element) {
  background: rgba(0, 0, 0, 0);
  width: max-content;
}

/* 레이저 요소 스타일 (중앙에 깜빡이는 레이저 효과) */
.custom-scanner :deep(.laser) {
  width: 0;
  animation: none;
}

.information {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2vh;

  ion-text {
    border-bottom: 1px solid white;
    padding-bottom: 3px;
  }

  ion-icon {
    margin-right: 2px;
  }
}

ion-modal {
  --height: auto;
  --border-radius: 24px;
  margin: 10px;
}

.block {
  width: 100%;
  height: max-content;
  padding: 20px;
}

.input {
  --border-color: #13BD7E;
  --border-radius: 12px;
  --border-width: 2px;
  margin: 15px 0 20px 0;

  --highlight-color-focused: #13BD7E;
}

.modal-title {
  margin: 10px 0 30px 0;
  text-align: center;
  font-size: 4.5vw;
  font-weight: bold;
  --color: #6B7684;
}

.modal-sub-title {
  display: flex;
  align-items: center;

  ion-icon {
    margin-right: 7px;
  }
}

.cancel-btn {
  text-align: center;

  ion-button {
    color: #6A7382;
  }
}

.horizontal-division {
  border-top: 2px solid #F0F2F4;
  padding: 25px 0;

  ion-text {
    color: #6B758F;
    display: flex;
    align-items: center;

    ion-icon {
      margin-right: 7px;
    }

    ion-label {
      color: #191F28;
    }
  }
}

.vertical-division {
  border-right: 2px solid #F0F2F4;
  margin: 0 15px;
}
</style>