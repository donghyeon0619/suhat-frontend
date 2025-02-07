import { defineStore } from 'pinia';
import {EventListener, EventSourcePolyfill} from "event-source-polyfill";
import {getJSessionId} from "@/api/sessionService";
import {showAlert} from "@/utils/showAlert";
import router from "@/router";
import {useGameStore} from "@/store/gameStore";
import {play} from "ionicons/icons";
import {get, post} from "@/api/httpService";

export const useEventSourceStore = defineStore('eventSource', {
  state: () => ({
    eventSource: null as EventSourcePolyfill | null,

    // 사용자(클라이언트) 측에서 '명시적으로' disconnect()를 호출했는지 여부
    // -> onerror 발생 시, 의도적으로 끊김이라면 재 연결 안함
    isDisconnectedByUser: false,
    isConnected: false, // 현재 연결 여부 표시
    pingInterval: null as ReturnType<typeof setInterval> | null,
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
      this.eventSource = new EventSourcePolyfill(url,
        {
          withCredentials: true,
          heartbeatTimeout: 60 * 1000 * 30, // 30분 타임아웃
        },
      );

      if(this.eventSource) {
        // 연결이 열렸을 때
        this.eventSource.onopen = () => {
          console.log('sse 연결이 열렸습니다.');
          this.isConnected = true;
        };

        // 서버로 부터 기본 메시지(onmessage)
        this.eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log(data.message);
        };


        // 오류 발생 시 (네트워크 단절, 서버 타임아웃 등)
        this.eventSource.onerror =  async (e) => {
          // 만약 게임이 이미 종료된 상태라면, 오류 처리는 건너뜀
          if (useGameStore().isGameEnded) {
            console.log("[SSE] 이미 게임 종료 상태입니다. onerror 무시");
            return;
          }

          if (!this.isDisconnectedByUser) {
            console.log('[SSE] 서버 혹은 네트워크 문제로 인한, 연결 종료', e);
            this.disconnect();
            await showAlert(
              "연결 에러",
              "서버 혹은 네트워크 문제로 연결 종료", [
                {
                  text: "확인", role: "confirm", handler: () => {
                    if(this.pingInterval){
                      this.stopPingInterval();
                    }
                    useGameStore().setGameEnded(true);
                    router.replace("/game/home");
                  }
                }]
            );
          }
          console.error('[SSE] 오류 발생 - 네트워크 및 서버 타임아웃으로 인한 연결 종료 ');

          // 브라우저의 기본 재연결 로직에 따라 자동 재연결 시도
        };
      } else {
        console.log("sse 연결이 안됨");
      }
    },

    /**
     * 특정 SSE 이벤트에 대한 이벤트 핸들러 등록 (동적)
     * @param eventName 이벤트 이름
     * @param handler 제거할 콜백함수
     */
    addEventListener(eventName: string, handler: (event: MessageEvent) => void) {
      if (!this.eventSource) {
        console.warn("[SSE] 연결을 먼저 하세요");
        return;
      }
      this.eventSource.addEventListener(eventName, (event) => handler(event as MessageEvent));
    },

    /**
     * 특정 SSE 이벤트 핸들러 제거 (동적)
     * @param eventName 이벤트 이름
     * @param handler 제거할 콜백함수
     */
    removeEventListener(eventName: string, handler: (event: MessageEvent) => void){
      if (!this.eventSource) {
        return;
      }
      this.eventSource.removeEventListener(eventName, (event) => handler(event as MessageEvent));
    },

    /**
     * 사용자가 "나가기" 등을 눌러 직접 끊을 때 호출
     */
    disconnectByUser(){
      this.isDisconnectedByUser = true;
      this.disconnect();
      this.stopPingInterval(); // ping 중단
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
    },

    /**
     * pingInterval 시작 메서드
     * @param roomId
     * @param playerId
     */
    startPingInterval(roomId: string) {
      if (this.pingInterval) {
        console.log("[ping] 이미 interval이 실행중입니다.");
        return;
      }

      console.log(`[Ping] startPingInterval: room=${roomId}`);
      this.pingInterval = setInterval(async () => {
        try {
          await post(`rooms/${roomId}/ping`);
          console.log("[Ping] 성공적으로 전송");
        } catch (error: any) {
          if (error.response.status === 404) {
            console.warn("[Ping] 이미 방에서 제거됨(404). 홈으로 이동합니다.");
            // pingInterval 중단
            this.stopPingInterval();
            // SSE disconnect
            this.disconnectByUser();
            // 라우터로 홈 이동
            await router.replace('/game/home');
          } else {
            console.error("[Ping] 전송 실패", error);
          }
        }
      }, 30_000); // 30초 주기로 ping
    },

    stopPingInterval(){
      if (this.pingInterval) {
        clearInterval(this.pingInterval);
        this.pingInterval = null;
        console.log("[Ping] pingInterval을 중단합니다.");
      }
    }

  }
})