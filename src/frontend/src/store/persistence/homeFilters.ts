// Home feed filter persistence
import { STORAGE_KEYS } from './storageKeys';

export interface HomeFilters {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  sort: 'recent' | 'price-low' | 'price-high';
}

const DEFAULT_FILTERS: HomeFilters = {
  sort: 'recent',
};

export function getHomeFilters(): HomeFilters {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HOME_FILTERS);
    if (!data) return DEFAULT_FILTERS;
    return { ...DEFAULT_FILTERS, ...JSON.parse(data) };
  } catch (e) {
    console.error('Failed to get home filters:', e);
    return DEFAULT_FILTERS;
  }
}

export function setHomeFilters(filters: HomeFilters): void {
  try {
    localStorage.setItem(STORAGE_KEYS.HOME_FILTERS, JSON.stringify(filters));
  } catch (e) {
    console.error('Failed to set home filters:', e);
  }
}

export function clearHomeFilters(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.HOME_FILTERS);
  } catch (e) {
    console.error('Failed to clear home filters:', e);
  }
}
