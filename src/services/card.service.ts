import {
  AddCardsRequestI,
  GetAllCardsResponseI,
} from '@/interfaces/card-response.interface';
import { PaginationQueryRequestI } from '@/interfaces/pagination-query-request.interface';
import api from './axios-setup.service';

const getAllCards = async ({
  rpp = 20,
  page,
}: PaginationQueryRequestI): Promise<GetAllCardsResponseI> => {
  try {
    const response = await api.get(`/cards?rpp=${rpp}&page=${page}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching get all cards:', error);
    throw error;
  }
};

const addLoggedUserCards = async (cardIds: AddCardsRequestI): Promise<void> => {
  try {
    const response = await api.post(`/me/cards`, { cardIds: cardIds });
    return response.data;
  } catch (error) {
    console.error('Error fetching user by id:', error);
    throw error;
  }
};

export { addLoggedUserCards, getAllCards };

