export const gameWaitingHooks: {
  onPauseHandler?: () => Promise<void>,
  onResumeHandler?: () => Promise<void>,
} = {}
