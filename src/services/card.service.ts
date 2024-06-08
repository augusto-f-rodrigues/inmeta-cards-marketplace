import {
  AddCardsRequest,
  GetAllCardsResponse,
} from '@/interfaces/card-response.interface';
import api from './axios-setup.service';

const getAllCards = async (): Promise<GetAllCardsResponse> => {
  try {
    const response = await api.get('/cards');
    return response.data;
  } catch (error) {
    console.error('Error fetching get all cards:', error);
    throw error;
  }
};

const addLoggedUserCards = async (cardIds: AddCardsRequest): Promise<void> => {
  try {
    const response = await api.post(`/me/cards`, { cardIds: cardIds });
    return response.data;
  } catch (error) {
    console.error('Error fetching user by id:', error);
    throw error;
  }
};

export { getAllCards, addLoggedUserCards };
