import axios, { AxiosError, AxiosInstance } from 'axios';

/**
 * Camada de acesso a APIs externas (Service Layer).
 * Todas as APIs usadas são gratuitas e SEM necessidade de chave:
 *  - Open-Meteo (clima + previsão + geocoding)
 *  - NASA APOD (usa DEMO_KEY)
 */

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

// Interceptor de log (apenas em desenvolvimento) — demonstra uso de interceptors.
[openMeteoForecast, openMeteoGeocoding, nasaApi].forEach((client) => {
  client.interceptors.request.use((config) => {
    if (__DEV__) {
      console.log(`[api] → ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    return config;
  });
});

/** Erro de API normalizado e amigável ao usuário. */
export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/** Converte qualquer erro em uma `ApiError` com mensagem em pt-BR. */
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
