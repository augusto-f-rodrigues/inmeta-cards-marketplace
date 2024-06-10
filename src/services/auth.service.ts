'use client';
import { LoginResponseI } from '@/interfaces/login-response.interface';
import { AxiosResponse } from 'axios';
import api from './axios-setup.service';

export const login = async (email: string, password: string): Promise<void> => {
  try {
    const response = await api.post<any, AxiosResponse<LoginResponseI, any>>(
      `/login`,
      { email, password },
    );
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('name', response.data.user.name);
    }
    return;
  } catch (error) {
    console.error('Error fetching user by id:', error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('name');
    }
    window.location.href = '/login';
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
};
