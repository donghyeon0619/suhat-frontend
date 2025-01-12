export interface PlayerInfo {
  name: string;
  gender: number;
  school: string;
}

export interface Player {
  playerId: number;
  playerInfo: PlayerInfo;
  sequenceNumber: number;
  collectedPuzzlePieces: number;
  isSpeaking: boolean;
  usageTime: number;
  surveyScore: number;
}
