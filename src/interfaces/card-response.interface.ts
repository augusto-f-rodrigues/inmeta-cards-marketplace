import { CardI } from './card.interface';

export interface GetCardsResponseI {
  list: CardI[];
  rpp: number;
  page: number;
  more: boolean;
}

export interface AddCardsRequestI {
  cardIds: string[];
}

export type UserLoggedCardsResponseT = CardI[];
