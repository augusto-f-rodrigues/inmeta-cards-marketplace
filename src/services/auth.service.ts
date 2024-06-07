import { useRouter } from 'next/navigation';
import api from './axios-setup.service';
import { LoginResponse } from '@/interfaces/login-response.interface';

export const login = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  try {
    const response = await api.post(`/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error('Error fetching user by id:', error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    localStorage.removeItem('token');
    const router = useRouter();
    router.push('/');
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
};
