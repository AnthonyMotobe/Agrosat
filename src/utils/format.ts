/** Helpers de formatação (pt-BR), sem dependência de Intl para máxima compatibilidade. */

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function parseDate(iso: string): Date {
  // Datas "YYYY-MM-DD" são tratadas como local para evitar deslocamento de fuso.
  return iso.length === 10 ? new Date(`${iso}T00:00:00`) : new Date(iso);
}

export function formatTemp(value?: number | null): string {
  return value == null || Number.isNaN(value) ? '--°' : `${Math.round(value)}°`;
}

export function formatPercent(value?: number | null): string {
  return value == null || Number.isNaN(value) ? '--' : `${Math.round(value)}%`;
}

export function formatMm(value?: number | null): string {
  return value == null || Number.isNaN(value) ? '--' : `${value.toFixed(1)} mm`;
}

export function formatNumber(value?: number | null, digits = 0): string {
  if (value == null || Number.isNaN(value)) return '--';
  return value.toLocaleString('pt-BR', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export function formatArea(ha: number): string {
  return `${formatNumber(ha)} ha`;
}

export function formatBRL(value?: number | null): string {
  if (value == null || Number.isNaN(value)) return 'R$ --';
  return `R$ ${Math.round(value).toLocaleString('pt-BR')}`;
}

export function weekdayShort(iso: string): string {
  return WEEKDAYS[parseDate(iso).getDay()];
}

export function dayMonth(iso: string): string {
  const d = parseDate(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${MONTHS[d.getMonth()]}`;
}

export function relativeFromNow(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.round(diffMs / 60000);
  if (min < 1) return 'agora mesmo';
  if (min < 60) return `há ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.round(h / 24);
  return `há ${d} d`;
}

export function capitalize(text: string): string {
  return text.length ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}
