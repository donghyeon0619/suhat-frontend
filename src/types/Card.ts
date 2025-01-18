export interface Card{
  id: number;
  isFlipped: boolean;
  type: "text" | "picture";
  content: string;
}

export  interface AssignedCard {
  cardId: number;
  cardType: "text" | "picture";
}