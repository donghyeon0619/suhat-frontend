import { App } from '@capacitor/app';
import { Network } from '@capacitor/network';
import { gameHooks } from '@/globals/gameHooks';
import { gameWaitingHooks } from '@/globals/gameWaitingHooks';

/** App and network transitions share one path; background events never leave a room. */
export async function registerGameLifecycle(currentRoute: () => unknown) {
  let active = (await App.getState()).isActive;
  let network = await Network.getStatus();
  let transition = Promise.resolve();

  function hooks() {
    if (currentRoute() === 'MultiGamePlay') return gameHooks;
    if (currentRoute() === 'GameWaiting') return gameWaitingHooks;
    return undefined;
  }

  function enqueue(action: () => Promise<void>) {
    transition = transition.then(action).catch(error => {
      console.error('게임 연결 상태 변경을 처리하지 못했습니다.', error);
    });
  }

  const appListener = await App.addListener('appStateChange', state => {
    if (active === state.isActive) return;
    active = state.isActive;
    const handler = active ? hooks()?.onResumeHandler : hooks()?.onPauseHandler;
    if (handler) enqueue(handler);
  });
  const networkListener = await Network.addListener('networkStatusChange', state => {
    const changed = network.connected !== state.connected || network.connectionType !== state.connectionType;
    network = state;
    if (!active || !changed) return;
    const currentHooks = hooks();
    const pause = currentHooks?.onPauseHandler;
    const resume = currentHooks?.onResumeHandler;
    enqueue(async () => {
      await pause?.();
      if (state.connected) await resume?.();
    });
  });

  return async () => {
    await appListener.remove();
    await networkListener.remove();
  };
}
