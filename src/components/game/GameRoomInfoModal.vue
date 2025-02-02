<script setup lang="ts">
import {
  alertController,
  IonButton,
  IonIcon,
  IonInput,
  IonLabel,
  IonText,
  IonTitle,
  modalController, useIonRouter
} from "@ionic/vue";
import BaseButton from "@/components/common/BaseButton.vue";
import {onMounted} from "vue";
import {post} from "@/api/httpService";
import {useUserStore} from "@/store/user";
import {useSurveyStore} from "@/store/survey";
import TagIcon from "@/assets/icons/game/tag-icon.svg"
import HumanIcon from "@/assets/icons/common/singleplay-icon.svg"
const props = defineProps({
  roomId: {
    type: String,
    required: true,
  },
  roomName: {
    type: String,
    required: true,
  },
  headCount: {
    type: Number,
    required: true,
  },
});

onMounted(() => {
  console.log("쾅쾅쾅쾅쾅쾅쾅쾅쾅\n" +
      "쾅쾅　　　　　쾅쾅\n" +
      "쾅쾅（∩8ㅁ8）쾅쾅\n" +
      "　＿/_ﾐつ/￣￣￣/\n" +
      "　　 ＼/＿＿＿/");
})

const router = useIonRouter();
const userStore = useUserStore();
const surveyStore = useSurveyStore();

async function enterGameRoom() {
  console.log(props.roomId);

  try {
    const response = await post(`rooms/${props.roomId}/players`, {userInfo: userStore.userInfo, score: surveyStore.latestScore});

    console.log("response: " + response);

    let topModal = await modalController.getTop(); // 최상위 모달 가져오기

    while (topModal) {
      await modalController.dismiss(); // 현재 모달 닫기
      topModal = await modalController.getTop(); // 다음 최상위 모달 확인
    }

    router.push({
      path: `/game/waiting/${props.roomId}`,
    });
  } catch (error) {
    console.log('게임 방 입장 오류 발생: ', error);
    await presentAlert('게임 방이 존재하지 않습니다.');
  }
  // 게임 방 입장 처리 로직
}


/**
 * 게임 방 입장 중 오류 핸들러 토스트
 * @param message
 */
const presentAlert = async (message: string) => {
  const alert = await alertController.create({
    header: '방 입장 ',
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

async function closeModal() {
  console.log("closeModal 호출");
  let topModal = await modalController.getTop(); // 최상위 모달 가져오기
  while (topModal) {
    await modalController.dismiss(); // 현재 모달 닫기
    topModal = await modalController.getTop(); // 다음 최상위 모달 확인
  }
}
</script>

<template>
  <div class="block">
    <IonTitle class="modal-title">방 입장하기</IonTitle>

    <IonText class="modal-sub-title">
      <IonIcon :src="TagIcon"></IonIcon>
      방 이름
    </IonText>
    <IonInput class="input" fill="outline" :value="roomName" readonly></IonInput>

    <div class="horizontal-division">
      <IonText>
        <IonIcon :src="HumanIcon"></IonIcon>
        인원 수<span class="vertical-division"></span>
        <IonLabel>{{headCount}}인 게임</IonLabel>
      </IonText>
    </div>
    <BaseButton button-text="입장하기" @click="enterGameRoom"></BaseButton>
    <div class="cancel-btn">
      <IonButton fill="clear" @click="closeModal">취소</IonButton>
    </div>
  </div>
</template>

<style scoped>
.block {
  background: white;
  height: fit-content;
  margin: auto 10px;
  padding: 20px;
  border-radius: 24px;
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