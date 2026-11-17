/** Revisions are scoped to a room and advance only after a snapshot is accepted. */
export function isNewerRevision(current: number, incoming: number): boolean {
  return Number.isSafeInteger(incoming) && incoming >= 0 && incoming > current;
}

export function remainingSeconds(deadline: number, serverOffset: number, now = Date.now()): number {
  return Math.max(0, Math.ceil((deadline - now - serverOffset) / 1000));
}
