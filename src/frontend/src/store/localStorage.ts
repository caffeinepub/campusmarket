const STORAGE_VERSION = 1;
const STORAGE_PREFIX = 'campusmarket_';

interface StorageData<T> {
  version: number;
  data: T;
}

export function setLocalStorageItem<T>(key: string, value: T): void {
  try {
    const storageData: StorageData<T> = {
      version: STORAGE_VERSION,
      data: value,
    };
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(storageData));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

export function getLocalStorageItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    if (!item) return null;

    const storageData: StorageData<T> = JSON.parse(item);

    // Version check for future migrations
    if (storageData.version !== STORAGE_VERSION) {
      console.warn('Storage version mismatch, clearing item');
      removeLocalStorageItem(key);
      return null;
    }

    return storageData.data;
  } catch (error) {
    console.error('Failed to read from localStorage:', error);
    return null;
  }
}

export function removeLocalStorageItem(key: string): void {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key);
  } catch (error) {
    console.error('Failed to remove from localStorage:', error);
  }
}

export function clearAllLocalStorage(): void {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
}
