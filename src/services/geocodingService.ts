import { openMeteoGeocoding, toApiError } from './api';
import { GeoResult } from '../types';

interface RawGeo {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

/** Busca localidades por nome (geocoding do Open-Meteo). */
export async function searchLocations(query: string): Promise<GeoResult[]> {
  const term = query.trim();
  if (term.length < 2) return [];
  try {
    const { data } = await openMeteoGeocoding.get('/search', {
      params: { name: term, count: 8, language: 'pt', format: 'json' },
    });
    const results: RawGeo[] = data?.results ?? [];
    return results.map((r) => ({
      id: String(r.id),
      name: r.name,
      latitude: r.latitude,
      longitude: r.longitude,
      country: r.country,
      state: r.admin1,
    }));
  } catch (error) {
    throw toApiError(error, 'buscar a localidade');
  }
}
