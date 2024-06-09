import { CardI } from './card.interface';
import { UserI } from './user.interface';

export interface GetAllTradeResponseI {
  list: TradeInfoI[];
  rpp: number;
  page: number;
  more: boolean;
}

export interface TradeInfoI {
  id: string;
  userId: string;
  createdAt: string;
  user: UserI;
  tradeCards: TradeCardI[];
}

export interface TradeCardI {
  id: string;
  cardId: string;
  tradeId: string;
  type: string;
  card: CardI;
}
