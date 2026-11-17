import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { useEventSourceStore } from '@/store/eventSourceStore';
import { post } from '@/api/httpService';

vi.mock('@/api/httpService', () => ({ post: vi.fn().mockResolvedValue({}) }));
vi.mock('event-source-polyfill', () => {
  class Connection {
    static connections: Connection[] = [];
    listeners = new Map<string, Set<(event: unknown) => void>>();
    onopen?: () => void;
    onerror?: (event: unknown) => void;
    close = vi.fn();
    constructor() { Connection.connections.push(this); }
    addEventListener(name: string, listener: (event: unknown) => void) {
      if (!this.listeners.has(name)) this.listeners.set(name, new Set());
      this.listeners.get(name)!.add(listener);
    }
    removeEventListener(name: string, listener: (event: unknown) => void) {
      this.listeners.get(name)?.delete(listener);
    }
    emit(name: string, event: unknown) { this.listeners.get(name)?.forEach(listener => listener(event)); }
  }
  return { EventSourcePolyfill: Connection };
});

type Connection = {
  onopen: () => void;
  onerror: (event: { status?: number }) => void;
  emit: (name: string, event: unknown) => void;
  close: ReturnType<typeof vi.fn>;
};
const connections = () => (EventSourcePolyfill as unknown as { connections: Connection[] }).connections;
const snapshot = (revision: number) => ({ lastEventId: String(revision), data: JSON.stringify({ roomId: 'room', revision }) });

beforeEach(() => {
  vi.useFakeTimers();
  setActivePinia(createPinia());
  connections().length = 0;
  vi.clearAllMocks();
});
afterEach(() => { vi.clearAllTimers(); vi.useRealTimers(); });

describe('SSE recovery', () => {
  it('registers before connecting and applies each revision once', () => {
    const store = useEventSourceStore();
    const handler = vi.fn();
    store.addEventListener('game-state', handler);
    store.connect('room');
    const connection = connections()[0];
    connection.emit('game-state', snapshot(4));
    connection.emit('game-state', snapshot(4));
    connection.emit('game-state', snapshot(3));
    expect(handler).toHaveBeenCalledTimes(1);
    expect(store.latestState?.revision).toBe(4);
  });

  it('removes the same callback and avoids duplicate registrations', () => {
    const store = useEventSourceStore();
    const handler = vi.fn();
    store.addEventListener('connected', handler);
    store.addEventListener('connected', handler);
    store.connect('room');
    connections()[0].emit('connected', {});
    expect(handler).toHaveBeenCalledTimes(1);
    store.removeEventListener('connected', handler);
    connections()[0].emit('connected', {});
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('reconnects after an error and ignores a stale transport', () => {
    const store = useEventSourceStore();
    store.connect('room');
    const previous = connections()[0];
    previous.onerror({});
    vi.advanceTimersByTime(1000);
    expect(connections()).toHaveLength(2);
    previous.emit('game-state', snapshot(99));
    connections()[1].emit('game-state', snapshot(5));
    expect(store.latestState?.revision).toBe(5);
  });

  it('suspends reconnect and heartbeat when the app pauses', () => {
    const store = useEventSourceStore();
    store.connect('room');
    connections()[0].onopen();
    store.disconnectByUser();
    connections()[0].onerror({});
    vi.advanceTimersByTime(60_000);
    expect(connections()).toHaveLength(1);
    expect(post).toHaveBeenCalledTimes(1);
  });

  it('stops retrying when membership expires', () => {
    const store = useEventSourceStore();
    const handler = vi.fn();
    store.addEventListener('not-in-room', handler);
    store.connect('room');
    connections()[0].onerror({ status: 410 });
    vi.advanceTimersByTime(60_000);
    expect(connections()).toHaveLength(1);
    expect(handler).toHaveBeenCalledOnce();
  });
});
