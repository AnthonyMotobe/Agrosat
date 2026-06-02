import { YieldEstimate, YieldRisk } from '../types';

const BASE_YIELD_T_HA: Record<string, number> = {
  Soja: 3.5,
  Milho: 6.0,
  Café: 1.8,
  Cana: 75,
  'Cana-de-açúcar': 75,
  Algodão: 4.5,
  Outros: 3.0,
};

const PRICE_BRL_T: Record<string, number> = {
  Soja: 2000,
  Milho: 1200,
  Café: 9000,
  Cana: 130,
  'Cana-de-açúcar': 130,
  Algodão: 8000,
  Outros: 2000,
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function estimateYield(score: number, crop: string, areaHa: number): YieldEstimate {
  const s = clamp(score, 0, 100);

  let productivityPct: number;
  let risk: YieldRisk;

  if (s >= 85) {
    productivityPct = 95 + ((s - 85) / 15) * 5;
    risk = 'baixo';
  } else if (s >= 70) {
    productivityPct = 80 + ((s - 70) / 15) * 14;
    risk = 'moderado';
  } else if (s >= 50) {
    productivityPct = 60 + ((s - 50) / 20) * 19;
    risk = 'alto';
  } else {
    productivityPct = 30 + (s / 50) * 29;
    risk = 'crítico';
  }

  productivityPct = Math.round(clamp(productivityPct, 0, 100));
  const lossPct = 100 - productivityPct;

  const baseYield = BASE_YIELD_T_HA[crop] ?? BASE_YIELD_T_HA.Outros;
  const price = PRICE_BRL_T[crop] ?? PRICE_BRL_T.Outros;
  const area = areaHa > 0 ? areaHa : 1;

  const potentialRevenueBRL = Math.round(baseYield * price * area);
  const estimatedLossBRL = Math.round((potentialRevenueBRL * lossPct) / 100);

  return {
    productivityPct,
    lossPct,
    risk,
    potentialRevenueBRL,
    estimatedLossBRL,
    explanation: buildExplanation(risk, productivityPct, lossPct),
  };
}

function buildExplanation(risk: YieldRisk, productivityPct: number, lossPct: number): string {
  switch (risk) {
    case 'baixo':
      return `Lavoura próxima do potencial produtivo (~${productivityPct}%). Perda estimada baixa (${lossPct}%).`;
    case 'moderado':
      return `Produtividade estimada em ~${productivityPct}% do potencial. Há perda evitável de ~${lossPct}% com manejo adequado.`;
    case 'alto':
      return `Produtividade comprometida (~${productivityPct}%). Perda estimada de ~${lossPct}% — recomenda-se ação corretiva.`;
    default:
      return `Risco crítico: produtividade estimada abaixo de 60% (~${productivityPct}%), com perda potencial de ~${lossPct}%.`;
  }
}
