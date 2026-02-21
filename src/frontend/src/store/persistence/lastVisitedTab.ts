// Last visited bottom-tab persistence
import { STORAGE_KEYS } from './storageKeys';
import { ROUTES } from '../../app/routes';

const VALID_TABS = [ROUTES.home, ROUTES.search, ROUTES.sell, ROUTES.chats, ROUTES.profile] as const;

export function getLastVisitedTab(): string | null {
  try {
    const tab = localStorage.getItem(STORAGE_KEYS.LAST_VISITED_TAB);
    if (tab && (VALID_TABS as readonly string[]).includes(tab)) {
      return tab;
    }
    return null;
  } catch (e) {
    console.error('Failed to get last visited tab:', e);
    return null;
  }
}

export function setLastVisitedTab(tab: string): void {
  try {
    if ((VALID_TABS as readonly string[]).includes(tab)) {
      localStorage.setItem(STORAGE_KEYS.LAST_VISITED_TAB, tab);
    }
  } catch (e) {
    console.error('Failed to set last visited tab:', e);
  }
}

export function clearLastVisitedTab(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.LAST_VISITED_TAB);
  } catch (e) {
    console.error('Failed to clear last visited tab:', e);
  }
}
