import { CardI } from '@/interfaces/card.interface';
import { RegisterResponseI } from '@/interfaces/register-response.interface';
import { UserLoggedResponseI } from '@/interfaces/user-response.interface';
import { UserI } from '@/interfaces/user.interface';
import api from './axios-setup.service';

const createUser = async (userData: UserI): Promise<RegisterResponseI> => {
  try {
    const response = await api.post('/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error fetching create user:', error);
    throw error;
  }
};

const getLoggedUserData = async (): Promise<UserLoggedResponseI> => {
  try {
    const response = await api.get(`/me`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user by id:', error);
    throw error;
  }
};

const getLoggedUserCardsData = async (): Promise<CardI[]> => {
  try {
    const response = await api.get(`/me/cards`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user by id:', error);
    throw error;
  }
};

export { createUser, getLoggedUserCardsData, getLoggedUserData };
