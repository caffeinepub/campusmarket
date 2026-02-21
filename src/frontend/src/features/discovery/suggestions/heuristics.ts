// Deterministic suggestion heuristics using local signals
import { getRecentlyViewed } from '../../../store/persistence/recentlyViewed';
import { getRecentSearches } from '../../../store/persistence/recentSearches';
import { getSavedListingsAuthOff } from '../../../store/persistence/savedListingsAuthOff';
import type { Listing } from '../../../backend';

export function generateSuggestions(allListings: Listing[], savedListingIds: string[]): Listing[] {
  const recentlyViewed = getRecentlyViewed();
  const recentSearches = getRecentSearches();
  const savedAuthOff = getSavedListingsAuthOff();

  // Combine all saved listing IDs
  const allSavedIds = new Set([...savedListingIds, ...savedAuthOff]);

  // Extract categories from viewed and saved listings
  const viewedIds = new Set(recentlyViewed.map(r => r.listingId));
  const viewedListings = allListings.filter(l => viewedIds.has(l.id));
  const savedListings = allListings.filter(l => allSavedIds.has(l.id));

  const categoryScores = new Map<string, number>();
  
  // Score categories from saved (higher weight)
  savedListings.forEach(l => {
    categoryScores.set(l.category, (categoryScores.get(l.category) || 0) + 3);
  });

  // Score categories from viewed
  viewedListings.forEach(l => {
    categoryScores.set(l.category, (categoryScores.get(l.category) || 0) + 2);
  });

  // Score categories from searches (lower weight)
  recentSearches.forEach(term => {
    allListings.forEach(l => {
      if (l.title.toLowerCase().includes(term.toLowerCase()) || 
          l.description.toLowerCase().includes(term.toLowerCase())) {
        categoryScores.set(l.category, (categoryScores.get(l.category) || 0) + 1);
      }
    });
  });

  // Filter out already saved/viewed listings
  const excludeIds = new Set([...viewedIds, ...allSavedIds]);
  const candidates = allListings.filter(l => !excludeIds.has(l.id) && l.status === 'active');

  // Score and sort candidates
  const scored = candidates.map(listing => ({
    listing,
    score: categoryScores.get(listing.category) || 0,
  }));

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    // Tie-break by recency
    return Number(b.listing.created_at - a.listing.created_at);
  });

  return scored.slice(0, 8).map(s => s.listing);
}

export function hasSufficientSignals(): boolean {
  const recentlyViewed = getRecentlyViewed();
  const recentSearches = getRecentSearches();
  const savedAuthOff = getSavedListingsAuthOff();
  
  return recentlyViewed.length + recentSearches.length + savedAuthOff.length >= 2;
}
