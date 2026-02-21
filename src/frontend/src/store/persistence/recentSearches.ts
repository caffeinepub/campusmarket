// Recent searches persistence (max 10, per-item delete, clear-all)
import { STORAGE_KEYS } from './storageKeys';

const MAX_SEARCHES = 10;

export function getRecentSearches(): string[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
    if (!data) return [];
    const searches: string[] = JSON.parse(data);
    return searches.slice(0, MAX_SEARCHES);
  } catch (e) {
    console.error('Failed to get recent searches:', e);
    return [];
  }
}

export function addRecentSearch(searchTerm: string): void {
  if (!searchTerm.trim()) return;
  try {
    const searches = getRecentSearches();
    const filtered = searches.filter(term => term !== searchTerm);
    const updated = [searchTerm, ...filtered].slice(0, MAX_SEARCHES);
    localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to add recent search:', e);
  }
}

export function deleteRecentSearch(searchTerm: string): void {
  try {
    const searches = getRecentSearches();
    const filtered = searches.filter(term => term !== searchTerm);
    localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to delete recent search:', e);
  }
}

export function clearRecentSearches(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.RECENT_SEARCHES);
  } catch (e) {
    console.error('Failed to clear recent searches:', e);
  }
}
