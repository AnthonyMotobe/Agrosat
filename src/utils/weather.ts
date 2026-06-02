import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export interface WeatherInfo {
  label: string;
  icon: IoniconName;
}

/** Traduz os códigos meteorológicos WMO (Open-Meteo) para rótulo + ícone. */
export function describeWeather(code: number, isDay = true): WeatherInfo {
  switch (code) {
    case 0:
      return { label: 'Céu limpo', icon: isDay ? 'sunny' : 'moon' };
    case 1:
      return { label: 'Predom. limpo', icon: isDay ? 'partly-sunny' : 'cloudy-night' };
    case 2:
      return { label: 'Parc. nublado', icon: isDay ? 'partly-sunny' : 'cloudy-night' };
    case 3:
      return { label: 'Nublado', icon: 'cloud' };
    case 45:
    case 48:
      return { label: 'Névoa', icon: 'cloud-outline' };
    case 51:
    case 53:
    case 55:
      return { label: 'Garoa', icon: 'rainy-outline' };
    case 56:
    case 57:
      return { label: 'Garoa congelante', icon: 'snow' };
    case 61:
    case 63:
    case 65:
      return { label: 'Chuva', icon: 'rainy' };
    case 66:
    case 67:
      return { label: 'Chuva congelante', icon: 'snow' };
    case 71:
    case 73:
    case 75:
    case 77:
      return { label: 'Neve', icon: 'snow' };
    case 80:
    case 81:
    case 82:
      return { label: 'Pancadas de chuva', icon: 'rainy' };
    case 85:
    case 86:
      return { label: 'Pancadas de neve', icon: 'snow' };
    case 95:
      return { label: 'Tempestade', icon: 'thunderstorm' };
    case 96:
    case 99:
      return { label: 'Tempestade c/ granizo', icon: 'thunderstorm' };
    default:
      return { label: 'Indefinido', icon: 'help-circle-outline' };
  }
}

/** Cor de status a partir de um score 0-100 (verde/âmbar/vermelho). */
export function statusFromScore(score: number): 'healthy' | 'warning' | 'critical' {
  if (score >= 66) return 'healthy';
  if (score >= 40) return 'warning';
  return 'critical';
}

export const STATUS_LABEL: Record<'healthy' | 'warning' | 'critical', string> = {
  healthy: 'Saudável',
  warning: 'Atenção',
  critical: 'Crítico',
};
