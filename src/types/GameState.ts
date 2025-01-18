import {Player} from "@/types/Player";

export interface GameState {
  roomId: string;
  roomName: string;
  hostId: number;
  totalPlayers: number;
  totalPuzzlePieces: number;
  currentPuzzlePieces: number;
  currentTurn: number;
  currentRound: number;
  players: Player[];
}