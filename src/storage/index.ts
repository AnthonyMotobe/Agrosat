import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
  themeMode: '@terramind/theme-mode',
  favorites: '@terramind/favorites',
  customRegions: '@terramind/custom-regions',
  settings: '@terramind/settings',
} as const;

export async function getItem<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`[storage] falha ao ler "${key}"`, error);
    return fallback;
  }
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`[storage] falha ao gravar "${key}"`, error);
  }
}

export async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.warn(`[storage] falha ao remover "${key}"`, error);
  }
}

export async function clearAll(): Promise<void> {
  try {
    await AsyncStorage.multiRemove(Object.values(StorageKeys));
  } catch (error) {
    console.warn('[storage] falha ao limpar dados', error);
  }
}
