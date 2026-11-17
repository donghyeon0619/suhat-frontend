import {Player} from "@/types/Player";

export enum GamePhase {
  NONE = 'NONE',
  DISCUSSION = 'DISCUSSION',
  VOTING = 'VOTING',
}

export interface GameState {
  lastVoteResult: { result?: string; agreeCount?: number; disagreeCount?: number; abstainCount?: number };
  revision: number;
  votingRound: number;
  serverTime: number;
  roomStatus: 'WAITING' | 'IN_GAME' | 'ENDED';
  speakingEndsAt: number;
  votingEndsAt: number;
  timeExtended: boolean;
  reVoting: boolean;
  votedPlayerIds: number[];
  ranking: import('@/types/Player').RankingPlayer[];
  roomId: string;
  roomName: string;
  hostId: number;
  totalPlayers: number;
  totalPuzzlePieces: number;
  currentPuzzlePieces: number;
  currentTurn: number;
  assignedTextCardId: number;
  assignedPictureCardId: number;
  currentPhase: GamePhase;
  currentRound: number;
  players: Player[];
}