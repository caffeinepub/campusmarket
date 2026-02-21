// In-memory + sessionStorage cache for autosuggest
const CACHE_KEY = 'caffeine:autosuggest:cache:v1';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  suggestions: string[];
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry>();

export function getCachedSuggestions(query: string): string[] | null {
  // Check memory cache first
  const memEntry = memoryCache.get(query);
  if (memEntry && Date.now() - memEntry.timestamp < CACHE_TTL) {
    return memEntry.suggestions;
  }

  // Check sessionStorage
  try {
    const stored = sessionStorage.getItem(CACHE_KEY);
    if (stored) {
      const cache: Record<string, CacheEntry> = JSON.parse(stored);
      const entry = cache[query];
      if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
        // Restore to memory cache
        memoryCache.set(query, entry);
        return entry.suggestions;
      }
    }
  } catch (e) {
    console.error('Failed to read autosuggest cache:', e);
  }

  return null;
}

export function cacheSuggestions(query: string, suggestions: string[]): void {
  const entry: CacheEntry = {
    suggestions,
    timestamp: Date.now(),
  };

  // Store in memory
  memoryCache.set(query, entry);

  // Store in sessionStorage
  try {
    const stored = sessionStorage.getItem(CACHE_KEY);
    const cache: Record<string, CacheEntry> = stored ? JSON.parse(stored) : {};
    cache[query] = entry;
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.error('Failed to write autosuggest cache:', e);
  }
}

export function clearAutosuggestCache(): void {
  memoryCache.clear();
  try {
    sessionStorage.removeItem(CACHE_KEY);
  } catch (e) {
    console.error('Failed to clear autosuggest cache:', e);
  }
}
