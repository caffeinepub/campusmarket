import type { Listing } from '../../backend';

export interface SavedFilters {
  category?: string;
  sort: 'recent' | 'price-low' | 'price-high';
}

export function applySavedFilters(listings: Listing[], filters: SavedFilters): Listing[] {
  let result = [...listings];

  // Apply category filter
  if (filters.category) {
    result = result.filter(listing => listing.category === filters.category);
  }

  // Apply sorting
  switch (filters.sort) {
    case 'price-low':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'recent':
    default:
      result.sort((a, b) => Number(b.created_at) - Number(a.created_at));
      break;
  }

  return result;
}
