import {defineStore} from 'pinia';
import {ref, watch} from "vue";
import {Network} from "@capacitor/network";
import { showAlert } from "@/utils/showAlert";

export const useNetworkStore = defineStore('network', () => {
  const isOnline = ref(true);

  async function setupNetworkListener() {
    const status = await Network.getStatus();
    isOnline.value = status.connected;

    // 상태 변경 리스너
    await Network.addListener('networkStatusChange', (newStatus) => {
      isOnline.value = newStatus.connected;
    })
  }
  // 오프라인 상태가 될 때 알림 띄우기
  watch(isOnline, async (newVal, oldVal) => {
    // 이전에는 true(온라인)이었는데 지금 false(오프라인)로 바뀐 경우
    if (oldVal === true && newVal === false) {
      // Ionic Alert 띄우기
      await showAlert(
        "네트워크 연결 오류",
        "네트워크가 연결되지 않았습니다. Wi-Fi 또는 데이터를 활성화 해주세요.", [
          {
            text: "확인", role: "confirm"
          }
        ],
        "custom-one-button-alert"
      )
    }
  });
  return {
    isOnline,
    setupNetworkListener,
  }
})