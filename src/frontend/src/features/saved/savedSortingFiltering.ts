import type { Listing } from '../../backend';
import { applySorting, type SortOption } from '../listings/filters/sortOptions';

export interface SavedFilters {
  category?: string;
  sort: SortOption;
}

export function applySavedFilters(listings: Listing[], filters: SavedFilters): Listing[] {
  let result = [...listings];

  // Apply category filter
  if (filters.category) {
    result = result.filter(listing => listing.category === filters.category);
  }

  // Apply sorting using centralized sort utility
  return applySorting(result, filters.sort);
}
