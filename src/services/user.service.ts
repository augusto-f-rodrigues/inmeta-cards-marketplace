import { User } from '@/interfaces/user.interface';
import api from './axios-setup.service';
import { RegisterResponse } from '@/interfaces/register-response.interface';
import { UserLoggedResponse } from '@/interfaces/user-response.interface';
import { Card } from '@/interfaces/card.interface';

const createUser = async (userData: User): Promise<RegisterResponse> => {
  try {
    const response = await api.post('/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error fetching create user:', error);
    throw error;
  }
};

const getLoggedUserData = async (): Promise<UserLoggedResponse> => {
  try {
    const response = await api.get(`/me`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user by id:', error);
    throw error;
  }
};

const getLoggedUserCardsData = async (): Promise<Card[]> => {
  try {
    const response = await api.get(`/me/cards`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user by id:', error);
    throw error;
  }
};

export { createUser, getLoggedUserData, getLoggedUserCardsData };
