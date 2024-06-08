import { GetAllTradeResponse } from '@/interfaces/trade-response.interface';
import api from './axios-setup.service';

const getAllTrades = async ({
  rpp,
  page,
}: {
  rpp: number;
  page: number;
}): Promise<GetAllTradeResponse> => {
  try {
    const response = await api.get(`/trades?rpp=${rpp}&page=${page}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching get all trades:', error);
    throw error;
  }
};

export { getAllTrades };