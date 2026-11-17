import { beforeEach, describe, expect, it, vi } from 'vitest';
import { registerGameLifecycle } from '@/services/gameLifecycle';
import { gameHooks } from '@/globals/gameHooks';

const mocks = vi.hoisted(() => ({ app: undefined as any, network: undefined as any, remove: vi.fn() }));
vi.mock('@capacitor/app', () => ({ App: {
  getState: vi.fn().mockResolvedValue({ isActive: true }),
  addListener: vi.fn(async (_: string, callback: any) => { mocks.app = callback; return { remove: mocks.remove }; }),
} }));
vi.mock('@capacitor/network', () => ({ Network: {
  getStatus: vi.fn().mockResolvedValue({ connected: true, connectionType: 'wifi' }),
  addListener: vi.fn(async (_: string, callback: any) => { mocks.network = callback; return { remove: mocks.remove }; }),
} }));

beforeEach(() => {
  vi.clearAllMocks();
  gameHooks.onPauseHandler = vi.fn().mockResolvedValue(undefined);
  gameHooks.onResumeHandler = vi.fn().mockResolvedValue(undefined);
});
const settle = () => new Promise(resolve => setTimeout(resolve, 0));

describe('Capacitor game lifecycle', () => {
  it('suspends once in background and reconnects once on foreground', async () => {
    const dispose = await registerGameLifecycle(() => 'MultiGamePlay');
    mocks.app({ isActive: false });
    mocks.app({ isActive: false });
    await settle();
    expect(gameHooks.onPauseHandler).toHaveBeenCalledOnce();
    mocks.app({ isActive: true });
    await settle();
    expect(gameHooks.onResumeHandler).toHaveBeenCalledOnce();
    await dispose();
    expect(mocks.remove).toHaveBeenCalledTimes(2);
  });

  it('replaces a transport when Wi-Fi changes to cellular', async () => {
    await registerGameLifecycle(() => 'MultiGamePlay');
    mocks.network({ connected: true, connectionType: 'cellular' });
    await settle();
    expect(gameHooks.onPauseHandler).toHaveBeenCalledOnce();
    expect(gameHooks.onResumeHandler).toHaveBeenCalledOnce();
  });

  it('does not open a connection for network changes while backgrounded', async () => {
    await registerGameLifecycle(() => 'MultiGamePlay');
    mocks.app({ isActive: false });
    mocks.network({ connected: false, connectionType: 'none' });
    mocks.network({ connected: true, connectionType: 'cellular' });
    await settle();
    expect(gameHooks.onResumeHandler).not.toHaveBeenCalled();
  });

  it('does not invoke game hooks on non-game screens', async () => {
    await registerGameLifecycle(() => 'HomePage');
    mocks.app({ isActive: false });
    await settle();
    expect(gameHooks.onPauseHandler).not.toHaveBeenCalled();
  });
});
