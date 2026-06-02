import { ClimateAlert, CropHealth, DailyForecast, Region, RegionMonitor } from '../types';
import { computeCropHealth } from './cropHealthService';
import { fetchForecast, fetchForecastBatch, ForecastBundle } from './weatherService';

/** Monta o monitoramento completo de uma região (clima + saúde + alertas). */
export async function getRegionMonitor(region: Region): Promise<RegionMonitor> {
  const bundle = await fetchForecast(region.latitude, region.longitude);
  return buildMonitor(region, bundle);
}

/** Monitora várias regiões em UMA única requisição (batch) para evitar rate limit. */
export async function getMonitors(regions: Region[]): Promise<RegionMonitor[]> {
  if (regions.length === 0) return [];
  const bundles = await fetchForecastBatch(
    regions.map((r) => ({ latitude: r.latitude, longitude: r.longitude })),
  );
  return regions.map((region, index) => buildMonitor(region, bundles[index]));
}

function buildMonitor(region: Region, bundle: ForecastBundle): RegionMonitor {
  const health = computeCropHealth(bundle);
  const future = bundle.daily.slice(bundle.todayIndex, bundle.todayIndex + 7);
  const alerts = buildAlerts(future, health);

  return {
    region,
    current: bundle.current,
    daily: future,
    health,
    alerts,
    updatedAt: new Date().toISOString(),
  };
}

/** Gera alertas climáticos a partir da previsão dos próximos dias. */
function buildAlerts(future: DailyForecast[], health: CropHealth): ClimateAlert[] {
  const alerts: ClimateAlert[] = [];

  const minTemp = Math.min(...future.map((d) => d.tempMin));
  if (minTemp <= 3) {
    alerts.push({
      type: 'frost',
      severity: minTemp <= 0 ? 'high' : 'medium',
      title: 'Risco de geada',
      description: `Temperatura mínima prevista de ${Math.round(minTemp)}°C nos próximos dias.`,
    });
  }

  const maxTemp = Math.max(...future.map((d) => d.tempMax));
  if (maxTemp >= 36) {
    alerts.push({
      type: 'heat',
      severity: maxTemp >= 40 ? 'high' : 'medium',
      title: 'Onda de calor',
      description: `Máxima de ${Math.round(maxTemp)}°C prevista — atenção à evapotranspiração.`,
    });
  }

  const maxRain = Math.max(...future.map((d) => d.precipitationSum));
  if (maxRain >= 50) {
    alerts.push({
      type: 'heavy_rain',
      severity: maxRain >= 90 ? 'high' : 'medium',
      title: 'Chuva intensa',
      description: `Até ${Math.round(maxRain)} mm em um único dia — risco de encharcamento.`,
    });
  }

  const rainNext7 = future.reduce((s, d) => s + d.precipitationSum, 0);
  if (health.hydricStress >= 60 && rainNext7 < 5) {
    alerts.push({
      type: 'drought',
      severity: health.hydricStress >= 80 ? 'high' : 'medium',
      title: 'Estresse hídrico',
      description: 'Solo seco e sem previsão de chuva significativa na semana.',
    });
  }

  return alerts;
}
