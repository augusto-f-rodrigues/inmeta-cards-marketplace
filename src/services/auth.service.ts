import { useRouter } from 'next/navigation';
import api from './axios-setup.service';
import { LoginResponseI } from '@/interfaces/login-response.interface';

export const login = async (
  email: string,
  password: string,
): Promise<LoginResponseI> => {
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
    localStorage.removeItem('name');
    const router = useRouter();
    router.push('/');
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
};
