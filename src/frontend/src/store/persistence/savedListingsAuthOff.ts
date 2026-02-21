// AUTH_OFF saved listings persistence
import { STORAGE_KEYS } from './storageKeys';

export function getSavedListingsAuthOff(): string[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SAVED_LISTINGS_AUTH_OFF);
    if (!data) return [];
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to get saved listings (AUTH_OFF):', e);
    return [];
  }
}

export function saveListingAuthOff(listingId: string): void {
  try {
    const saved = getSavedListingsAuthOff();
    if (!saved.includes(listingId)) {
      localStorage.setItem(STORAGE_KEYS.SAVED_LISTINGS_AUTH_OFF, JSON.stringify([...saved, listingId]));
    }
  } catch (e) {
    console.error('Failed to save listing (AUTH_OFF):', e);
  }
}

export function unsaveListingAuthOff(listingId: string): void {
  try {
    const saved = getSavedListingsAuthOff();
    const filtered = saved.filter(id => id !== listingId);
    localStorage.setItem(STORAGE_KEYS.SAVED_LISTINGS_AUTH_OFF, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to unsave listing (AUTH_OFF):', e);
  }
}

export function isListingSavedAuthOff(listingId: string): boolean {
  return getSavedListingsAuthOff().includes(listingId);
}

export function clearSavedListingsAuthOff(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.SAVED_LISTINGS_AUTH_OFF);
  } catch (e) {
    console.error('Failed to clear saved listings (AUTH_OFF):', e);
  }
}
