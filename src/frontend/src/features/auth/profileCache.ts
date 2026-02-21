// Profile cache helper for localStorage persistence
import { getLocalStorageItem, setLocalStorageItem, removeLocalStorageItem } from '../../store/localStorage';
import type { UserProfile } from '../../backend';

const PROFILE_CACHE_KEY = 'cached_user_profile';

export function getCachedProfile(): UserProfile | null {
  try {
    return getLocalStorageItem<UserProfile>(PROFILE_CACHE_KEY);
  } catch (e) {
    console.error('Failed to get cached profile:', e);
    return null;
  }
}

export function setCachedProfile(profile: UserProfile): void {
  try {
    setLocalStorageItem(PROFILE_CACHE_KEY, profile);
  } catch (e) {
    console.error('Failed to cache profile:', e);
  }
}

export function clearCachedProfile(): void {
  try {
    removeLocalStorageItem(PROFILE_CACHE_KEY);
  } catch (e) {
    console.error('Failed to clear cached profile:', e);
  }
}
