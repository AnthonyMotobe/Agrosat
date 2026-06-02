import axios, { AxiosError, AxiosInstance } from 'axios';

export const openMeteoForecast: AxiosInstance = axios.create({
  baseURL: 'https://api.open-meteo.com/v1',
  timeout: 12000,
});

export const openMeteoGeocoding: AxiosInstance = axios.create({
  baseURL: 'https://geocoding-api.open-meteo.com/v1',
  timeout: 12000,
});

export const nasaApi: AxiosInstance = axios.create({
  baseURL: 'https://api.nasa.gov',
  timeout: 12000,
});

[openMeteoForecast, openMeteoGeocoding, nasaApi].forEach((client) => {
  client.interceptors.request.use((config) => {
    if (__DEV__) {
      console.log(`[api] → ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    return config;
  });
});

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function toApiError(error: unknown, context: string): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    if (axiosError.code === 'ECONNABORTED') {
      return new ApiError(`Tempo de conexão esgotado ao ${context}.`, status);
    }
    if (!axiosError.response) {
      return new ApiError(`Sem conexão ao ${context}. Verifique sua internet.`, status);
    }
    return new ApiError(`Falha ao ${context} (HTTP ${status}).`, status);
  }
  return new ApiError(`Erro inesperado ao ${context}.`);
}
