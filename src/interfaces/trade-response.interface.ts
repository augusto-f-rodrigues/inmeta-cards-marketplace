import { Card } from './card.interface';
import { User } from './user.interface';

export interface TradeResponse {
  list: List[];
  rpp: number;
  page: number;
  more: boolean;
}

export interface List {
  id: string;
  userId: string;
  createdAt: string;
  user: User;
  tradeCards: TradeCard[];
}

export interface TradeCard {
  id: string;
  cardId: string;
  tradeId: string;
  type: string;
  card: Card;
}
