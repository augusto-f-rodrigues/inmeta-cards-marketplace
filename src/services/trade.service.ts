import { PaginationQueryRequestI } from '@/interfaces/pagination-query-request.interface';
import {
  CreateTradeRequestI,
  CreateTradeResponseI,
  GetTradeResponseI,
  TradeInfoI,
} from '@/interfaces/trade-response.interface';
import api from './axios-setup.service';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import useUser from '@/hooks/useUser';

const capitalizeWords = (str: string) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return format(date, 'dd/MM/yyyy', { locale: ptBR });
};

const getAllTrades = async ({
  rpp = 20,
  page,
}: PaginationQueryRequestI): Promise<GetTradeResponseI> => {
  try {
    const response = await api.get(`/trades?rpp=${rpp}&page=${page}`);
    const formattedTrades = response.data.list.map((trade: TradeInfoI) => ({
      ...trade,
      user: {
        ...trade.user,
        name: capitalizeWords(trade.user.name),
      },
      createdAt: formatDate(trade.createdAt),
    }));
    return {
      ...response.data,
      list: formattedTrades,
    };
  } catch (error) {
    console.error('Error fetching get all trades:', error);
    throw error;
  }
};

const getAllTradesFromLoggedUser = async (): Promise<GetTradeResponseI> => {
  try {
    const user = useUser();

    if (!user) {
      throw new Error('User not logged in');
    }

    let allTrades: TradeInfoI[] = [];
    let currentPage = 1;
    let more = true;

    while (more) {
      const response = await api.get(`/trades?rpp=20&page=${currentPage}`);
      const filteredTrades = response.data.list.filter(
        (trade: TradeInfoI) => trade.userId === user.id,
      );

      const formattedTrades = filteredTrades.map((trade: TradeInfoI) => ({
        ...trade,
        user: {
          ...trade.user,
          name: capitalizeWords(trade.user.name),
        },
        createdAt: formatDate(trade.createdAt),
      }));

      allTrades = [...allTrades, ...formattedTrades];
      more = response.data.more;
      currentPage += 1;
    }

    return {
      list: allTrades,
      rpp: 20,
      page: currentPage,
      more: false,
    };
  } catch (error) {
    console.error('Error fetching get all trades from logged user:', error);
    throw error;
  }
};

const createTrade = async (
  cards: CreateTradeRequestI,
): Promise<CreateTradeResponseI> => {
  try {
    const response = await api.post(`/trades`, cards);
    return response.data;
  } catch (error) {
    console.error('Error fetching create trades:', error);
    throw error;
  }
};

export { getAllTrades, getAllTradesFromLoggedUser, createTrade };
