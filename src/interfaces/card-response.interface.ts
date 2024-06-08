import { Card } from './card.interface';

export interface GetAllCardsResponse {
  list: Card[];
  rpp: number;
  page: number;
  more: boolean;
}

export interface AddCardsRequest {
  cardIds: string[];
}

export type UserLoggedCardsResponse = Card[];
