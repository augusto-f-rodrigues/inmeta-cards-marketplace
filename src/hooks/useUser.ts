import { UserLoggedResponseI } from '@/interfaces/user-response.interface';
import { getLoggedUserData } from '@/services/user.service';
import { useState, useEffect } from 'react';

export default function useUser() {
  const [user, setUser] = useState<UserLoggedResponseI | null>(null);

  const checkUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await getLoggedUserData();
        setUser(res);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return user;
}
