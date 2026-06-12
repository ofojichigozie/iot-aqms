import api from './api';
import { ApiResponse, Reading, Stats } from '../types';

export const fetchReadings = async (limit = 100): Promise<Reading[]> => {
  const res = await api.get<ApiResponse<Reading[]>>(`/readings?limit=${limit}`);
  return res.data.data;
};

export const fetchLatestReading = async (): Promise<Reading> => {
  const res = await api.get<ApiResponse<Reading>>('/readings/latest');
  return res.data.data;
};

export const fetchStats = async (): Promise<Stats> => {
  const res = await api.get<ApiResponse<Stats>>('/readings/stats');
  return res.data.data;
};

export const deleteReading = async (id: string): Promise<void> => {
  await api.delete(`/readings/${id}`);
};
