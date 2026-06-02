import axios from 'axios';
import { openMeteoForecast, toApiError } from './api';
import { DailyForecast, WeatherSnapshot } from '../types';

/** Pacote bruto retornado pela API de clima (atual + diário + índice de "hoje"). */
export interface ForecastBundle {
  current: WeatherSnapshot;
  daily: DailyForecast[];
  todayIndex: number;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}

const FORECAST_PARAMS = {
  current: [
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'is_day',
    'precipitation',
    'weather_code',
    'wind_speed_10m',
    'soil_moisture_0_to_1cm',
  ].join(','),
  daily: [
    'weather_code',
    'temperature_2m_max',
    'temperature_2m_min',
    'precipitation_sum',
    'precipitation_probability_max',
    'et0_fao_evapotranspiration',
  ].join(','),
  timezone: 'auto',
  past_days: 7,
  forecast_days: 7,
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Faz a requisição com 1 tentativa extra em caso de HTTP 429 (rate limit). */
async function requestForecast(params: Record<string, unknown>) {
  try {
    return await openMeteoForecast.get('/forecast', { params });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 429) {
      await delay(1800);
      return openMeteoForecast.get('/forecast', { params });
    }
    throw error;
  }
}

function parseBundle(data: any): ForecastBundle {
  const c = data.current;
  const current: WeatherSnapshot = {
    temperature: c.temperature_2m,
    apparentTemperature: c.apparent_temperature,
    humidity: c.relative_humidity_2m,
    precipitation: c.precipitation,
    windSpeed: c.wind_speed_10m,
    weatherCode: c.weather_code,
    soilMoisture: c.soil_moisture_0_to_1cm ?? null,
    isDay: c.is_day === 1,
    time: c.time,
  };

  const d = data.daily;
  const daily: DailyForecast[] = (d.time as string[]).map((date, i) => ({
    date,
    tempMax: d.temperature_2m_max[i],
    tempMin: d.temperature_2m_min[i],
    precipitationSum: d.precipitation_sum[i] ?? 0,
    precipitationProbability: d.precipitation_probability_max?.[i] ?? 0,
    weatherCode: d.weather_code[i],
    et0: d.et0_fao_evapotranspiration?.[i] ?? null,
  }));

  const todayKey = typeof c.time === 'string' ? c.time.slice(0, 10) : '';
  const foundIndex = (d.time as string[]).indexOf(todayKey);
  const todayIndex = foundIndex >= 0 ? foundIndex : Math.min(7, daily.length - 1);

  return { current, daily, todayIndex };
}

/** Busca clima atual + previsão de um único ponto. */
export async function fetchForecast(latitude: number, longitude: number): Promise<ForecastBundle> {
  try {
    const { data } = await requestForecast({ latitude, longitude, ...FORECAST_PARAMS });
    return parseBundle(data);
  } catch (error) {
    throw toApiError(error, 'carregar a previsão do tempo');
  }
}

/**
 * Busca a previsão de VÁRIOS pontos numa única requisição.
 * O Open-Meteo aceita coordenadas separadas por vírgula e devolve um array,
 * evitando rajadas de requisições (e o erro 429).
 */
export async function fetchForecastBatch(coords: Coordinate[]): Promise<ForecastBundle[]> {
  if (coords.length === 0) return [];
  try {
    const { data } = await requestForecast({
      latitude: coords.map((c) => c.latitude).join(','),
      longitude: coords.map((c) => c.longitude).join(','),
      ...FORECAST_PARAMS,
    });
    const list = Array.isArray(data) ? data : [data];
    return list.map(parseBundle);
  } catch (error) {
    throw toApiError(error, 'carregar a previsão do tempo');
  }
}
