<script setup lang="ts">
import {
  IonContent,
  IonTitle,
  IonText,
  IonIcon,
  IonInput,
  IonModal,
  IonButton,
  modalController,
  alertController, IonToolbar, IonHeader,
} from "@ionic/vue"
import Header from "@/components/common/BackButtonHeader.vue";
import BaseButton from "@/components/common/BaseButton.vue";
import { ref } from "vue";
import { get } from "@/api/httpService";
import GameRoomInfoModal from "@/components/game/GameRoomInfoModal.vue";
import InformationIcon from "@/assets/icons/game/informaion-icon.svg";
import CancelIcon from "@/assets/icons/game/cancel-icon.svg";
import SearchIcon from "@/assets/icons/game/search-icon.svg";
import {
  CapacitorBarcodeScanner,
  CapacitorBarcodeScannerOptions,
  CapacitorBarcodeScannerTypeHintALLOption
} from "@capacitor/barcode-scanner";

const roomId = ref(null);
const roomName = ref('방 이름');
const headCount = ref(4);

const findRoom = async () => {
  if (!roomId.value) {
    await presentAlert('바코드 번호를 입력해주세요');
    return;
  }

  try {
    const response = await get(`rooms/${roomId.value}`);

    if (response) {
      roomName.value = response.roomName;
      headCount.value = response.totalPlayers;

      const newModal = await modalController.create({
        component: GameRoomInfoModal,
        componentProps: {
          roomId: roomId.value,
          roomName: roomName.value,
          headCount: headCount.value,
        },
        cssClass: "game-room-info-modal"
      });

      await newModal.present();
    } else {
      await presentAlert('해당 방이 존재하지 않습니다.');
    }
  } catch (error) {
    console.error('게임방을 찾는 중 오류가 발생했습니다:', error);
    await presentAlert('게임방을 찾을 수 없습니다.');
  }
};

const presentAlert = async (message: string) => {
  const alert = await alertController.create({
    header: '방 찾기 ',
    message: message,
    buttons: [
      {
        text: '확인',
        role: 'confirm',
        cssClass: "my-custom-alert-button-class",
      },
    ],
    cssClass: "custom-one-button-alert"
  });
  await alert.present();
}

function closeModal() {
  modalController.dismiss();
}

const options: CapacitorBarcodeScannerOptions = {
  hint: CapacitorBarcodeScannerTypeHintALLOption.ALL,
  scanInstructions: '아래 사각형 안에 바코드가\n꽉차도록 맞춰주세요',
};

async function scanBarcode() {
  try {
    const result = (await CapacitorBarcodeScanner.scanBarcode(options)).ScanResult;
    roomId.value = result;
    console.error("스캔 성공: ", roomId.value);
    await findRoom();
  } catch (error) {
    console.error("스캔 오류:", error);
  }
}
</script>

<template>
  <IonHeader class="ion-no-border">
    <IonToolbar>
    </IonToolbar>
  </IonHeader>
  <ion-content class="background">
    <ion-title class="title">방 입장하기</ion-title>
    <ion-text class="description">아래 버튼을 눌러주세요</ion-text><br>

    <!-- Barcode scanner button -->
    <ion-button class="scan" @click="scanBarcode">바코드 스캔 시작</ion-button>

    <div class="information">
      <ion-text id="enter-room-id">
        <ion-icon :src="InformationIcon"></ion-icon>
        바코드가 인식되지 않나요?
      </ion-text>
    </div>

    <ion-icon class="cancel-icon" :src="CancelIcon" @click="closeModal"></ion-icon>

    <ion-modal class="ion-no-margin" trigger="enter-room-id">
      <div class="block">
        <ion-title class="modal-title">방 입장하기</ion-title>

        <ion-text class="modal-sub-title">
          <ion-icon :src="SearchIcon"></ion-icon>
          방 바코드 번호
        </ion-text>
        <ion-input class="input" fill="outline" v-model="roomId"></ion-input>
        <BaseButton id="check-game-room" button-text="검색" @click="findRoom"></BaseButton>
        <div class="cancel-btn">
          <ion-button fill="clear" @click="closeModal">취소</ion-button>
        </div>
      </div>
    </ion-modal>
  </ion-content>
</template>

<style scoped>
.background {
  --background: black;
  opacity: 0.8;
  --color: white;
  display: flex;
  text-align: center;
}

:deep(ion-toolbar) {
  --background: black;
  opacity: 0.8;
}

:deep(ion-back-button::part(icon)) {
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
  --margin: 0;
  padding: 10px;
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

.scan {
  margin:2vh;
  --background: #13BD7E;
}
</style>