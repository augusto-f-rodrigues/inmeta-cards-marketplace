import { TRADE_CARD_TYPES_ENUM } from '@/enums/trade-card-types.enum';
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

export interface CreateTradeRequestI {
  cards: CreateTradeCardRequestI[];
}

export interface CreateTradeCardRequestI {
  cardId: string;
  type: TRADE_CARD_TYPES_ENUM;
}

export interface CreateTradeResponseI {
  tradeId: string;
}
