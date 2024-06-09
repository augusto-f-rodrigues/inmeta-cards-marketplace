import { PaginationQueryRequestI } from '@/interfaces/pagination-query-request.interface';
import { GetAllTradeResponseI } from '@/interfaces/trade-response.interface';
import api from './axios-setup.service';

const getAllTrades = async ({
  rpp = 20,
  page,
}: PaginationQueryRequestI): Promise<GetAllTradeResponseI> => {
  try {
    const response = await api.get(`/trades?rpp=${rpp}&page=${page}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching get all trades:', error);
    throw error;
  }
};

export { getAllTrades };
