import {defineStore} from 'pinia';
import {ref, watch} from "vue";
import {Network} from "@capacitor/network";
import { showAlert } from "@/utils/showAlert";

export const useNetworkStore = defineStore('network', () => {
  const isOnline = ref(true);
  let isListenerSetup = false;

  async function setupNetworkListener() {

    if (isListenerSetup) return; // 이미 리스너가 존재할 시
    isListenerSetup = true;

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
    if (oldVal && !newVal) {
      await showOfflineAlert()
    }
  });

  /**
   * "네트워크 연결 오류" 경고창을 보여주는 함수
   * 만약 "확인" 버튼을 누르면 네트워크 재확인 후, 여전히 오프라인이면 다시 띄움
   */
  async function showOfflineAlert() {
    await showAlert(
      "네트워크 연결 오류",
      "네트워크가 연결되지 않았습니다. Wi-Fi 또는 데이터를 활성화 해주세요.", [
        {
          text: "확인",
          role: "confirm",
          handler: async () => {
            // "확인" 버튼을 누른 순간 네트워크 다시 체크
            const status = await Network.getStatus();
            if (!status.connected) {
              // 여전히 오프라인라면 다시 알림창 띄우기
              await showOfflineAlert();
            }
          }
        }
      ],
      "custom-one-button-alert"
    )
  }

  return {
    isOnline,
    setupNetworkListener,
  }
});