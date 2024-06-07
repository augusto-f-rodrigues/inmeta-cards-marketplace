import { Card } from './card.interface';

export interface UserLoggedResponse {
  id: string;
  name: string;
  email: string;
  cards: Card[];
}

export interface UserLoggedCardsRequest {
  cardIds: string[];
}
