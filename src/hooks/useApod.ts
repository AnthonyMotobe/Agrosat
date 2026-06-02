import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../services/api';
import { fetchApod } from '../services/nasaService';
import { Apod } from '../types';

interface State {
  data: Apod | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/** Carrega a imagem astronômica do dia (NASA APOD). */
export function useApod(): State {
  const [data, setData] = useState<Apod | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await fetchApod());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível carregar a imagem da NASA.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
