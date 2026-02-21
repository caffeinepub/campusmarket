// Deterministic feed computations for Trending and Recommended
import { getRecentlyViewed } from '../../../store/persistence/recentlyViewed';
import { getRecentSearches } from '../../../store/persistence/recentSearches';
import { getSavedListingsAuthOff } from '../../../store/persistence/savedListingsAuthOff';
import type { Listing } from '../../../backend';

export function computeTrendingFeed(allListings: Listing[], limit: number = 8): Listing[] {
  const recentlyViewed = getRecentlyViewed();
  const recentSearches = getRecentSearches();

  // Score listings based on local signals
  const categoryScores = new Map<string, number>();
  
  // Score from recently viewed
  const viewedIds = new Set(recentlyViewed.map(r => r.listingId));
  const viewedListings = allListings.filter(l => viewedIds.has(l.id));
  viewedListings.forEach(l => {
    categoryScores.set(l.category, (categoryScores.get(l.category) || 0) + 2);
  });

  // Score from recent searches
  recentSearches.forEach(term => {
    allListings.forEach(l => {
      if (l.title.toLowerCase().includes(term.toLowerCase()) || 
          l.category.toLowerCase().includes(term.toLowerCase())) {
        categoryScores.set(l.category, (categoryScores.get(l.category) || 0) + 1);
      }
    });
  });

  // Filter active listings
  const activeListings = allListings.filter(l => l.status === 'active');

  // Score and sort
  const scored = activeListings.map(listing => ({
    listing,
    score: categoryScores.get(listing.category) || 0,
  }));

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    // Tie-break by recency
    return Number(b.listing.created_at - a.listing.created_at);
  });

  return scored.slice(0, limit).map(s => s.listing);
}

export function computeRecommendedFeed(
  allListings: Listing[],
  savedListingIds: string[],
  limit: number = 8
): Listing[] {
  const recentlyViewed = getRecentlyViewed();
  const recentSearches = getRecentSearches();
  const savedAuthOff = getSavedListingsAuthOff();

  // Combine all saved and viewed IDs to exclude
  const excludeIds = new Set([
    ...savedListingIds,
    ...savedAuthOff,
    ...recentlyViewed.map(r => r.listingId),
  ]);

  // Extract categories from saved listings
  const allSavedIds = new Set([...savedListingIds, ...savedAuthOff]);
  const savedListings = allListings.filter(l => allSavedIds.has(l.id));
  
  const categoryScores = new Map<string, number>();
  savedListings.forEach(l => {
    categoryScores.set(l.category, (categoryScores.get(l.category) || 0) + 3);
  });

  // Score from searches
  recentSearches.forEach(term => {
    allListings.forEach(l => {
      if (l.title.toLowerCase().includes(term.toLowerCase()) || 
          l.description.toLowerCase().includes(term.toLowerCase())) {
        categoryScores.set(l.category, (categoryScores.get(l.category) || 0) + 1);
      }
    });
  });

  // Filter candidates (exclude saved/viewed, only active)
  const candidates = allListings.filter(
    l => !excludeIds.has(l.id) && l.status === 'active'
  );

  // Score and sort
  const scored = candidates.map(listing => ({
    listing,
    score: categoryScores.get(listing.category) || 0,
  }));

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return Number(b.listing.created_at - a.listing.created_at);
  });

  return scored.slice(0, limit).map(s => s.listing);
}

export function hasSufficientSignalsForFeeds(): boolean {
  const recentlyViewed = getRecentlyViewed();
  const recentSearches = getRecentSearches();
  const savedAuthOff = getSavedListingsAuthOff();
  
  return recentlyViewed.length + recentSearches.length + savedAuthOff.length >= 1;
}
