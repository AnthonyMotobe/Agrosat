import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getItem, setItem, StorageKeys } from '../storage';
import { SEED_REGIONS } from '../data/regions';
import { Region } from '../types';

interface RegionsContextValue {
  regions: Region[];
  customRegions: Region[];
  addRegion: (region: Region) => void;
  removeRegion: (id: string) => void;
  getRegion: (id: string) => Region | undefined;
  clearCustomRegions: () => void;
  ready: boolean;
}

const RegionsContext = createContext<RegionsContextValue | undefined>(undefined);

export function RegionsProvider({ children }: { children: React.ReactNode }) {
  const [customRegions, setCustomRegions] = useState<Region[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getItem<Region[]>(StorageKeys.customRegions, []).then((stored) => {
      setCustomRegions(stored);
      setReady(true);
    });
  }, []);

  const persist = useCallback((next: Region[]) => {
    setCustomRegions(next);
    void setItem(StorageKeys.customRegions, next);
  }, []);

  const addRegion = useCallback(
    (region: Region) => {
      setCustomRegions((prev) => {
        if (prev.some((r) => r.id === region.id) || SEED_REGIONS.some((r) => r.id === region.id)) {
          return prev;
        }
        const next = [...prev, { ...region, custom: true }];
        void setItem(StorageKeys.customRegions, next);
        return next;
      });
    },
    [],
  );

  const removeRegion = useCallback(
    (id: string) => {
      persist(customRegions.filter((r) => r.id !== id));
    },
    [customRegions, persist],
  );

  const clearCustomRegions = useCallback(() => persist([]), [persist]);

  const regions = useMemo(() => [...SEED_REGIONS, ...customRegions], [customRegions]);

  const getRegion = useCallback((id: string) => regions.find((r) => r.id === id), [regions]);

  const value = useMemo<RegionsContextValue>(
    () => ({ regions, customRegions, addRegion, removeRegion, getRegion, clearCustomRegions, ready }),
    [regions, customRegions, addRegion, removeRegion, getRegion, clearCustomRegions, ready],
  );

  return <RegionsContext.Provider value={value}>{children}</RegionsContext.Provider>;
}

export function useRegions(): RegionsContextValue {
  const ctx = useContext(RegionsContext);
  if (!ctx) throw new Error('useRegions deve ser usado dentro de <RegionsProvider>.');
  return ctx;
}
