import { CropHealth } from '../types';
import { statusFromScore } from '../utils/weather';
import { ForecastBundle } from './weatherService';

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

/**
 * Calcula um índice de saúde da lavoura (proxy de NDVI) a partir de dados REAIS:
 *  - umidade do solo (0-1cm)
 *  - balanço hídrico recente (precipitação − evapotranspiração)
 *  - estresse térmico (calor extremo / risco de geada)
 *
 * Não é um NDVI medido por satélite multiespectral (isso exige imagens Sentinel/Landsat),
 * mas um indicador agroclimático explicável e baseado em dados observados.
 */
export function computeCropHealth(bundle: ForecastBundle): CropHealth {
  const { current, daily, todayIndex } = bundle;

  const start = Math.max(0, todayIndex - 6);
  const window = daily.slice(start, todayIndex + 1);
  const days = Math.max(1, window.length);

  const precipTotal = window.reduce((s, d) => s + (d.precipitationSum ?? 0), 0);
  const hasEt0 = window.some((d) => d.et0 != null);
  const et0Total = hasEt0
    ? window.reduce((s, d) => s + (d.et0 ?? 0), 0)
    : days * 3.5; // demanda hídrica nominal quando a API não retorna ET0
  const waterBalance = precipTotal - et0Total;

  const sm = current.soilMoisture;
  const smScore = sm == null ? null : clamp((sm - 0.1) / 0.25, 0, 1);
  const wbScore = clamp((waterBalance + 40) / 60, 0, 1);

  const avgMax = avg(window.map((d) => d.tempMax));
  const minMin = Math.min(...window.map((d) => d.tempMin));
  let tempScore = 1;
  if (avgMax > 34) tempScore -= clamp((avgMax - 34) / 10, 0, 0.6);
  if (minMin < 4) tempScore -= clamp((4 - minMin) / 8, 0, 0.5);
  tempScore = clamp(tempScore, 0, 1);

  const health =
    smScore == null
      ? clamp(0.65 * wbScore + 0.35 * tempScore, 0, 1)
      : clamp(0.45 * smScore + 0.4 * wbScore + 0.15 * tempScore, 0, 1);

  const ndvi = Number((0.15 + 0.7 * health).toFixed(2));
  const score = Math.round(health * 100);
  const stressBase = smScore == null ? wbScore : 0.5 * smScore + 0.5 * wbScore;
  const hydricStress = Math.round(clamp(1 - stressBase, 0, 1) * 100);
  const status = statusFromScore(score);

  return {
    score,
    ndvi,
    status,
    hydricStress,
    waterBalanceMm: Math.round(waterBalance),
    summary: buildSummary(status, waterBalance, minMin, avgMax),
  };
}

function buildSummary(
  status: CropHealth['status'],
  waterBalance: number,
  minMin: number,
  avgMax: number,
): string {
  const parts: string[] = [];

  if (waterBalance < -15) {
    parts.push('déficit hídrico relevante na última semana');
  } else if (waterBalance < 0) {
    parts.push('leve déficit hídrico');
  } else {
    parts.push('balanço hídrico positivo');
  }

  if (minMin < 4) parts.push('risco de geada');
  if (avgMax > 34) parts.push('estresse por calor');

  const prefix =
    status === 'healthy'
      ? 'Lavoura saudável'
      : status === 'warning'
        ? 'Atenção necessária'
        : 'Condição crítica';

  return `${prefix}: ${parts.join(', ')}.`;
}
