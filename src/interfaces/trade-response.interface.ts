import { Card } from './card.interface';
import { User } from './user.interface';

export interface GetAllTradeResponse {
  list: TradeInfo[];
  rpp: number;
  page: number;
  more: boolean;
}

export interface TradeInfo {
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
