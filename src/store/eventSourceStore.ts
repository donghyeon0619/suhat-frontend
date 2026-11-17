import { defineStore } from 'pinia';
import { ref, shallowRef } from 'vue';
import { EventSourcePolyfill, Event as SseEvent } from 'event-source-polyfill';
import { post } from '@/api/httpService';
import { GameState } from '@/types/GameState';
import { isNewerRevision } from '@/utils/gameRevision';

type Handler = (event: MessageEvent) => void;
import { API_URL } from '@/config/api';

export const useEventSourceStore = defineStore('eventSource', () => {
  const eventSource = shallowRef<EventSourcePolyfill | null>(null);
  const isConnected = ref(false);
  const isDisconnectedByUser = ref(false);
  const latestState = shallowRef<GameState | null>(null);
  const listeners = new Map<string, Set<Handler>>();
  const bindings = new Map<string, (event: SseEvent) => void>();
  let activeRoom = '';
  let retryCount = 0;
  let retryTimer: ReturnType<typeof setTimeout> | undefined;
  let pingTimer: ReturnType<typeof setInterval> | undefined;

  function dispatch(name: string, event: MessageEvent) {
    listeners.get(name)?.forEach(handler => handler(event));
  }

  function bind(name: string) {
    if (!eventSource.value || bindings.has(name)) return;
    const listener = (event: SseEvent) => dispatch(name, event as MessageEvent);
    bindings.set(name, listener);
    eventSource.value.addEventListener(name, listener);
  }

  function addEventListener(name: string, handler: Handler) {
    if (!listeners.has(name)) listeners.set(name, new Set());
    listeners.get(name)!.add(handler);
    if (name !== 'game-state') bind(name);
  }

  function removeEventListener(name: string, handler: Handler) {
    listeners.get(name)?.delete(handler);
    if (listeners.get(name)?.size === 0) {
      listeners.delete(name);
      const listener = bindings.get(name);
      if (listener) eventSource.value?.removeEventListener(name, listener);
      bindings.delete(name);
    }
  }

  function stopPingInterval() {
    clearInterval(pingTimer);
    pingTimer = undefined;
  }

  function disconnect() {
    clearTimeout(retryTimer);
    retryTimer = undefined;
    stopPingInterval();
    const source = eventSource.value;
    eventSource.value = null;
    source?.close();
    bindings.clear();
    isConnected.value = false;
  }

  function startPingInterval(roomId: string) {
    stopPingInterval();
    const ping = () => post(`rooms/${roomId}/ping`).catch(() => {
      // SSE reconnect or the server's grace deadline decides membership.
    });
    void ping();
    pingTimer = setInterval(ping, 30_000);
  }

  function connect(roomId: string) {
    if (eventSource.value && activeRoom === roomId) return;
    disconnect();
    if (activeRoom !== roomId) {
      latestState.value = null;
      retryCount = 0;
    }
    activeRoom = roomId;
    isDisconnectedByUser.value = false;
    const source = new EventSourcePolyfill(`${API_URL}/api/sse/rooms/connect/${roomId}`, {
      withCredentials: true,
      heartbeatTimeout: 60_000,
    });
    eventSource.value = source;
    source.onopen = () => {
      if (eventSource.value !== source) return;
      isConnected.value = true;
      retryCount = 0;
      startPingInterval(roomId);
    };
    source.addEventListener('game-state', raw => {
      if (eventSource.value !== source) return;
      const event = raw as MessageEvent;
      try {
        const state = JSON.parse(event.data) as GameState;
        if (state.roomId !== roomId || String(state.revision) !== event.lastEventId
            || !isNewerRevision(latestState.value?.revision ?? -1, state.revision)) return;
        latestState.value = state;
        dispatch('game-state', event);
      } catch (error) {
        console.error('게임 상태를 읽지 못했습니다.', error);
      }
    });
    listeners.forEach((_, name) => { if (name !== 'game-state') bind(name); });
    source.onerror = raw => {
      if (eventSource.value !== source || isDisconnectedByUser.value) return;
      const status = (raw as SseEvent & { status?: number }).status;
      disconnect();
      if (status === 401 || status === 403 || status === 404 || status === 410) {
        isDisconnectedByUser.value = true;
        dispatch('not-in-room', new MessageEvent('not-in-room', { data: '방에 다시 입장해주세요.' }));
        return;
      }
      const delay = Math.min(1000 * 2 ** retryCount++, 30_000);
      retryTimer = setTimeout(() => connect(roomId), delay);
    };
  }

  function disconnectByUser() {
    isDisconnectedByUser.value = true;
    disconnect();
  }

  return { eventSource, isConnected, isDisconnectedByUser, latestState, connect,
    disconnect, disconnectByUser, addEventListener, removeEventListener,
    startPingInterval, stopPingInterval };
});
