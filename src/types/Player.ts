export interface PlayerInfo {
  name: string;
  gender: number;
  school: string;
}

export interface Player {
  disconnectedAt: number;
  usageTimeSubmitted: boolean;
  playerId: number;
  playerInfo: PlayerInfo;
  sequenceNumber: number;
  collectedPuzzlePieces: number;
  speaking: boolean;
  usageTime: number;
  surveyScore: number;
}

export interface RankingPlayer {
  playerId: number;
  playerName:string;
  puzzlePieces: number;
}
