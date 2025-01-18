import {RankingPlayer} from "@/types/Player";

export interface PuzzleAcquiredResult {
  type: "puzzle-acquired";
  agreeCount: number;
  disagreeCount: number;
  hasReVoted: boolean;
  nextSpeakerId?: number;
}

export interface ReVoteResult {
  type: "re-vote";
  agreeCount: number;
  disagreeCount: number;
  disagreePlayers: string[];
}

export interface PuzzleFailedResult {
  type: "puzzle-failed";
  agreeCount: number;
  disagreeCount: number;
  nextSpeakerId?: number;
}

export interface GameCompletedResult {
  type: "game-completed";
  agreeCount: number;
  disagreeCount: number;
  rankingData: Array<RankingPlayer>;
  hasReVoted: boolean;
}

export type VoteResult = PuzzleAcquiredResult | ReVoteResult | PuzzleFailedResult | GameCompletedResult;
