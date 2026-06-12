import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/auth.service';
import { useAuth } from '../context/AuthContext';
import { notify } from '../utils/notification';

export const useLogin = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await authService.login(email, password);
      auth.login(result.token, result.admin);
      notify.success(`Welcome back, ${result.admin.name}!`);
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Login failed';
      notify.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};
