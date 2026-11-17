import { describe, expect, it } from 'vitest';
import { isNewerRevision, remainingSeconds } from '@/utils/gameRevision';

describe('game state recovery', () => {
  it('ignores duplicate and out-of-order snapshots', () => {
    expect(isNewerRevision(12, 12)).toBe(false);
    expect(isNewerRevision(12, 11)).toBe(false);
    expect(isNewerRevision(12, 15)).toBe(true);
    expect(isNewerRevision(12, NaN)).toBe(false);
  });

  it('uses the server deadline after a background pause', () => {
    expect(remainingSeconds(200_000, 5_000, 100_000)).toBe(95);
    expect(remainingSeconds(200_000, 5_000, 180_000)).toBe(15);
    expect(remainingSeconds(200_000, 5_000, 210_000)).toBe(0);
  });
});
