// Recently viewed listings persistence (max 20, dedupe, timestamp ordering)
import { STORAGE_KEYS } from './storageKeys';

export interface RecentlyViewedItem {
  listingId: string;
  timestamp: number;
}

const MAX_ITEMS = 20;

export function getRecentlyViewed(): RecentlyViewedItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED);
    if (!data) return [];
    const items: RecentlyViewedItem[] = JSON.parse(data);
    return items.sort((a, b) => b.timestamp - a.timestamp).slice(0, MAX_ITEMS);
  } catch (e) {
    console.error('Failed to get recently viewed:', e);
    return [];
  }
}

export function addRecentlyViewed(listingId: string): void {
  try {
    const items = getRecentlyViewed();
    const filtered = items.filter(item => item.listingId !== listingId);
    const updated: RecentlyViewedItem[] = [
      { listingId, timestamp: Date.now() },
      ...filtered
    ].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to add recently viewed:', e);
  }
}

export function clearRecentlyViewed(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.RECENTLY_VIEWED);
  } catch (e) {
    console.error('Failed to clear recently viewed:', e);
  }
}
