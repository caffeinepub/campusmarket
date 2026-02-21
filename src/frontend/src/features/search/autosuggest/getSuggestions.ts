// Deterministic autosuggest generation
import { getCachedSuggestions, cacheSuggestions } from './autosuggestCache';
import { getRecentSearches } from '../../../store/persistence/recentSearches';
import type { Listing } from '../../../backend';

export function getAutosuggest(query: string, listings: Listing[]): string[] {
  if (!query.trim()) return [];

  const cached = getCachedSuggestions(query);
  if (cached) return cached;

  const lowerQuery = query.toLowerCase();
  const suggestions = new Set<string>();

  // Add matching recent searches
  const recentSearches = getRecentSearches();
  recentSearches.forEach(term => {
    if (term.toLowerCase().includes(lowerQuery)) {
      suggestions.add(term);
    }
  });

  // Add matching listing titles
  listings.forEach(listing => {
    if (listing.title.toLowerCase().includes(lowerQuery)) {
      suggestions.add(listing.title);
    }
  });

  // Add matching categories
  const categories = new Set(listings.map(l => l.category));
  categories.forEach(cat => {
    if (cat.toLowerCase().includes(lowerQuery)) {
      suggestions.add(cat);
    }
  });

  const result = Array.from(suggestions).slice(0, 5);
  cacheSuggestions(query, result);
  return result;
}
