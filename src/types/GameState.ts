import {Player} from "@/types/Player";

export enum GamePhase {
  NONE = 'NONE',
  DISCUSSION = 'DISCUSSION',
  VOTING = 'VOTING',
}

export interface GameState {
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