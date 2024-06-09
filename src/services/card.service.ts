import {
  AddCardsRequestI,
  GetAllCardsResponseI,
} from '@/interfaces/card-response.interface';
import { PaginationQueryRequestI } from '@/interfaces/pagination-query-request.interface';
import api from './axios-setup.service';
import { CardI } from '@/interfaces/card.interface';

const getAllCards = async ({
  rpp = 20,
  page,
}: PaginationQueryRequestI): Promise<GetAllCardsResponseI> => {
  try {
    const response = await api.get(`/cards?rpp=${rpp}&page=${page}`);
    const filteredData = response.data.list.filter(
      (card: CardI) => card.imageUrl && card.name,
    );
    return { ...response.data, list: filteredData };
  } catch (error) {
    console.error('Error fetching get all cards:', error);
    throw error;
  }
};

const addCardsToUser = async (cardIds: string[]): Promise<void> => {
  try {
    const response = await api.post(`/me/cards`, { cardIds: cardIds });
    return;
  } catch (error) {
    console.error('Error fetching user by id:', error);
    throw error;
  }
};

const getCardsFromLoggedUser = async (): Promise<CardI[]> => {
  try {
    const response = await api.get(`/me/cards`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user by id:', error);
    throw error;
  }
};

const deleteCardFromLoggedUser = async (id: string): Promise<void> => {
  try {
    await api.delete(`/me/cards/${id}`);
    return;
  } catch (error) {
    console.error('Error fetching user by id:', error);
    throw error;
  }
};

export {
  addCardsToUser,
  getAllCards,
  getCardsFromLoggedUser,
  deleteCardFromLoggedUser,
};

