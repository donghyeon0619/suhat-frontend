import { alertController } from "@ionic/vue";

/**
 * 재사용 가능한 경고창 유틸리티 함수
 * @param header - 경고창 헤더 텍스트
 * @param message - 경고창 메시지 텍스트
 * @param buttons - 버튼 배열 (기본값: 확인 버튼 하나)
 * @param singleButtonClass - 단일 버튼용 CSS 클래스 (기본값: "custom-one-button-alert")
 * @param doubleButtonClass - 두 개 버튼용 CSS 클래스 (기본값: "my-custom-alert-class")
 */
export const showAlert = async (
  header: string,
  message: string,
  buttons: Array<{
    text: string;
    role?: string;
    cssClass?: string;
    handler?: () => void;
  }> = [
    // Default 버튼 설정
    { text: "확인", role: "confirm", cssClass: "my-custom-alert-button-class" },
  ],
  singleButtonClass: string = "custom-one-button-alert",
  doubleButtonClass: string = "my-custom-alert-class"
): Promise<void> => {
  // 버튼 개수에 따라 CSS 클래스 선택
  const cssClass = buttons.length === 1 ? singleButtonClass : doubleButtonClass;

  const alert = await alertController.create({
    header,
    message,
    buttons,
    cssClass,
  });

  await alert.present();
};