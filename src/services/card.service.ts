import { GetAllCardsResponse } from '@/interfaces/card-response.interface';
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

export { getAllCards };
