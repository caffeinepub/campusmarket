// Cookie utility for campus_slug and UI preferences
// Note: In browser JS, we simulate cookies via localStorage since HTTP-only cookies cannot be set/read by JS
import { STORAGE_KEYS } from './storageKeys';

export interface CookiePreferences {
  campus_slug?: string;
  prefers_dark_mode?: boolean;
  ui_motion_level?: 'full' | 'reduced';
}

export function getCookiePreferences(): CookiePreferences {
  try {
    const campus_slug = localStorage.getItem(STORAGE_KEYS.CAMPUS_SLUG);
    const prefers_dark_mode = localStorage.getItem(STORAGE_KEYS.PREFERS_DARK_MODE);
    const ui_motion_level = localStorage.getItem(STORAGE_KEYS.UI_MOTION_LEVEL);

    return {
      campus_slug: campus_slug || undefined,
      prefers_dark_mode: prefers_dark_mode === 'true',
      ui_motion_level: (ui_motion_level as 'full' | 'reduced') || 'full',
    };
  } catch (e) {
    console.error('Failed to read cookie preferences:', e);
    return {};
  }
}

export function setCookiePreference(key: keyof CookiePreferences, value: string | boolean): void {
  try {
    const storageKey = key === 'campus_slug' ? STORAGE_KEYS.CAMPUS_SLUG :
                       key === 'prefers_dark_mode' ? STORAGE_KEYS.PREFERS_DARK_MODE :
                       STORAGE_KEYS.UI_MOTION_LEVEL;
    localStorage.setItem(storageKey, String(value));
  } catch (e) {
    console.error('Failed to set cookie preference:', e);
  }
}

export function clearCookiePreferences(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.CAMPUS_SLUG);
    localStorage.removeItem(STORAGE_KEYS.PREFERS_DARK_MODE);
    localStorage.removeItem(STORAGE_KEYS.UI_MOTION_LEVEL);
  } catch (e) {
    console.error('Failed to clear cookie preferences:', e);
  }
}
