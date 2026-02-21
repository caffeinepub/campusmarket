// Client-side persisted flag for Guest/Dev mode continuation during startup failures
import { getLocalStorageItem, setLocalStorageItem, removeLocalStorageItem } from '../../store/localStorage';

const DEV_GUEST_MODE_KEY = 'dev_guest_mode';

export function isDevGuestModeEnabled(): boolean {
  return getLocalStorageItem<boolean>(DEV_GUEST_MODE_KEY) === true;
}

export function enableDevGuestMode(): void {
  setLocalStorageItem(DEV_GUEST_MODE_KEY, true);
}

export function disableDevGuestMode(): void {
  removeLocalStorageItem(DEV_GUEST_MODE_KEY);
}
