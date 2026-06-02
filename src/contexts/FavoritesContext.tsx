import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getItem, setItem, StorageKeys } from '../storage';

interface FavoritesContextValue {
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    getItem<string[]>(StorageKeys.favorites, []).then(setFavorites);
  }, []);

  const persist = useCallback((next: string[]) => {
    setFavorites(next);
    void setItem(StorageKeys.favorites, next);
  }, []);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  const toggleFavorite = useCallback(
    (id: string) => {
      persist(favorites.includes(id) ? favorites.filter((fav) => fav !== id) : [...favorites, id]);
    },
    [favorites, persist],
  );

  const clearFavorites = useCallback(() => persist([]), [persist]);

  const value = useMemo<FavoritesContextValue>(
    () => ({ favorites, isFavorite, toggleFavorite, clearFavorites }),
    [favorites, isFavorite, toggleFavorite, clearFavorites],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites deve ser usado dentro de <FavoritesProvider>.');
  return ctx;
}
