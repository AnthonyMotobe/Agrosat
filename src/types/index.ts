

export type CropStatus = 'healthy' | 'warning' | 'critical';

export type AlertType = 'frost' | 'drought' | 'heavy_rain' | 'heat';
export type AlertSeverity = 'low' | 'medium' | 'high';

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

  custom?: boolean;
}

export interface WeatherSnapshot {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  weatherCode: number;

  soilMoisture: number | null;
  isDay: boolean;
  time: string;
}

export interface DailyForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
  precipitationProbability: number;
  weatherCode: number;

  et0: number | null;
}

export interface ClimateAlert {
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  description: string;
}

export interface CropHealth {

  score: number;

  ndvi: number;
  status: CropStatus;

  hydricStress: number;

  waterBalanceMm: number;
  summary: string;
}

export interface RegionMonitor {
  region: Region;
  current: WeatherSnapshot;
  daily: DailyForecast[];
  health: CropHealth;
  alerts: ClimateAlert[];
  updatedAt: string;
}

export interface Apod {
  title: string;
  date: string;
  explanation: string;
  url: string;
  hdurl?: string;
  mediaType: string;
  copyright?: string;
}

export interface GeoResult {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  state?: string;
}

export type YieldRisk = 'baixo' | 'moderado' | 'alto' | 'crítico';

export interface YieldEstimate {

  productivityPct: number;

  lossPct: number;
  risk: YieldRisk;

  potentialRevenueBRL: number;

  estimatedLossBRL: number;
  explanation: string;
}
