import api from './api';
import { ApiResponse, LoginResult } from '../types';

export const login = async (email: string, password: string): Promise<LoginResult> => {
  const res = await api.post<ApiResponse<LoginResult>>('/auth/login', { email, password });
  return res.data.data;
};
