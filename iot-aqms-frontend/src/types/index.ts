export type AirQualityStatus = 'Good' | 'Moderate' | 'Poor' | 'Dangerous';

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
}

export interface Reading {
  _id: string;
  deviceId: string;
  sensorValue: number;
  airQualityStatus: AirQualityStatus;
  timestamp: string;
  createdAt: string;
}

export interface Stats {
  totalReadings: number;
  latestReading: Reading | null;
  averageSensorValue: number;
  dangerousReadingsCount: number;
}

export interface Admin {
  name: string;
  email: string;
}

export interface LoginResult {
  token: string;
  admin: Admin;
}
