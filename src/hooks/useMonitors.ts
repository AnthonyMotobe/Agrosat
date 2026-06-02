import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../services/api';
import { getMonitors } from '../services/monitorService';
import { Region, RegionMonitor } from '../types';

interface State {
  data: RegionMonitor[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useMonitors(regions: Region[]): State {
  const [data, setData] = useState<RegionMonitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ids = regions.map((r) => r.id).join(',');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await getMonitors(regions));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível carregar os dados.');
    } finally {
      setLoading(false);
    }

  }, [ids]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
