import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../services/api';
import { getRegionMonitor } from '../services/monitorService';
import { Region, RegionMonitor } from '../types';

interface State {
  data: RegionMonitor | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/** Carrega o monitoramento de uma única região. */
export function useRegionMonitor(region: Region | undefined): State {
  const [data, setData] = useState<RegionMonitor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!region) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setData(await getRegionMonitor(region));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível carregar os dados.');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region?.id]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
