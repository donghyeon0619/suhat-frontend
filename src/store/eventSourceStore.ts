import { defineStore } from 'pinia';

export const useEventSourceStore = defineStore('eventSource', {
  state: () => ({
    eventSource: null as EventSource | null,

    // 사용자(클라이언트) 측에서 '명시적으로' disconnect()를 호출했는지 여부
    // -> onerror 발생 시, 의도적으로 끊김이라면 재 연결 안함
    isDisconnectedByUser: false,
    isConnected: false, // 현재 연결 여부 표시
  }),

  actions: {
    connect(url: string){
      // 이미 연결되어 있으면 중복 연결 방지
      if(this.eventSource){
        console.log('SSE 가 이미 연결됬거나 연결중입니다')
        return;
      }

      this.isDisconnectedByUser = false; // 의도적으로 끊김 상태 해제
      this.isConnected = false;

      console.log(`SSE 연결중: ${url}`)
      this.eventSource = new EventSource(url, {withCredentials: true});

      // 연결이 열렸을 때
      this.eventSource.onopen = () =>{
        console.log('sse 연결이 열렸습니다.');
        this.isConnected =true;
      };

      // 서버로 부터 기본 메시지(onmessage)
      this.eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log(data.message);
      };

      // 오류 발생 시 (네트워크 단절, 서버 타임아웃 등)
      this.eventSource.onerror = () => {
        if (this.isDisconnectedByUser) {
          console.log('[SSE] 사용자가 의도적으로 연결을 끊었습니다.');
          return;
        }

        console.error('[SSE] 오류 발생 - 네트워크 및 서버 타임아웃으로 인한 연결 종료 ');

        // 브라우저의 기본 재연결 로직에 따라 자동 재연결 시도
      };
    },

    /**
     * 특정 SSE 이벤트에 대한 이벤트 핸들러 등록 (동적)
     * @param eventName 이벤트 이름
     * @param handler 제거할 콜백함수
     */
    addEventListener(eventName: string, handler: (e: MessageEvent) => void){
      if(!this.eventSource){
        console.warn("[SSE] 연결을 먼저 하세요");
        return;
      }
      this.eventSource.addEventListener(eventName, handler);
    },

    /**
     * 특정 SSE 이벤트 핸들러 제거 (동적)
     * @param eventName 이벤트 이름
     * @param handler 제거할 콜백함수
     */
    removeEventListener(eventName: string, handler: (e: MessageEvent) => void){
      if (!this.eventSource) {
        console.warn("[SSE] 연결을 먼저 하세요");
        return;
      }
      this.eventSource.removeEventListener(eventName, handler);
    },

    /**
     * 사용자가 "나가기" 등을 눌러 직접 끊을 때 호출
     */
    disconnectByUser(){
      this.isDisconnectedByUser = true;
      this.disconnect();
    },

    /**
     * SSE 연결 해제 (내부 메서드)
     */
    disconnect(){
      if(this.eventSource) {
        console.log("연결을 끊습니다")
        this.eventSource.close();
        this.eventSource = null;
      }
      this.isConnected = false;
    }
  }
})