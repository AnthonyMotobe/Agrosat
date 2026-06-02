/** Modelos de domínio do AgroSat. */

export type CropStatus = 'healthy' | 'warning' | 'critical';

export type AlertType = 'frost' | 'drought' | 'heavy_rain' | 'heat';
export type AlertSeverity = 'low' | 'medium' | 'high';

/** Talhão / região monitorada. */
export interface Region {
  id: string;
  name: string;
  crop: string;
  latitude: number;
  longitude: number;
  areaHa: number;
  locality?: string;
  state?: string;
  country?: string;
  /** true quando a região foi adicionada pelo usuário (não faz parte do seed). */
  custom?: boolean;
}

/** Condições atuais retornadas pela API de clima. */
export interface WeatherSnapshot {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  weatherCode: number;
  /** Umidade do solo 0-1cm (m³/m³), quando disponível. */
  soilMoisture: number | null;
  isDay: boolean;
  time: string;
}

/** Previsão diária. */
export interface DailyForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
  precipitationProbability: number;
  weatherCode: number;
  /** Evapotranspiração de referência (mm), quando disponível. */
  et0: number | null;
}

/** Alerta climático derivado da previsão. */
export interface ClimateAlert {
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  description: string;
}

/** Índice de saúde da lavoura (proxy de NDVI) calculado a partir de dados reais. */
export interface CropHealth {
  /** 0-100 para exibição. */
  score: number;
  /** 0-1 (estilo NDVI). */
  ndvi: number;
  status: CropStatus;
  /** 0-100, quanto maior pior o estresse hídrico. */
  hydricStress: number;
  /** Balanço hídrico dos últimos dias (mm). Negativo = déficit. */
  waterBalanceMm: number;
  summary: string;
}

/** Agregado completo de uma região (clima + previsão + saúde + alertas). */
export interface RegionMonitor {
  region: Region;
  current: WeatherSnapshot;
  daily: DailyForecast[];
  health: CropHealth;
  alerts: ClimateAlert[];
  updatedAt: string;
}

/** Astronomy Picture of the Day (NASA). */
export interface Apod {
  title: string;
  date: string;
  explanation: string;
  url: string;
  hdurl?: string;
  mediaType: string;
  copyright?: string;
}

/** Resultado de busca de localidade (geocoding). */
export interface GeoResult {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  state?: string;
}

export type YieldRisk = 'baixo' | 'moderado' | 'alto' | 'crítico';

/** Estimativa heurística de safra derivada do índice de saúde da lavoura. */
export interface YieldEstimate {
  /** Produtividade estimada como % do potencial (0-100). */
  productivityPct: number;
  /** Perda estimada (0-100). */
  lossPct: number;
  risk: YieldRisk;
  /** Receita potencial de referência para a área (R$, aproximada). */
  potentialRevenueBRL: number;
  /** Perda financeira estimada para a área (R$, aproximada). */
  estimatedLossBRL: number;
  explanation: string;
}
