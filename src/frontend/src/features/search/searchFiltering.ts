// Shared client-side filtering and sorting helpers for Search
import type { Listing } from '../../backend';

export interface SearchFilters {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  sort: 'relevance' | 'newest' | 'price-low' | 'price-high';
}

export function applySearchFilters(listings: Listing[], filters: SearchFilters): Listing[] {
  let filtered = [...listings];

  // Apply category filter
  if (filters.category) {
    filtered = filtered.filter(l => l.category === filters.category);
  }

  // Apply price range filter
  if (filters.priceMin !== undefined) {
    filtered = filtered.filter(l => l.price >= filters.priceMin!);
  }
  if (filters.priceMax !== undefined) {
    filtered = filtered.filter(l => l.price <= filters.priceMax!);
  }

  // Apply sort with stable ordering
  switch (filters.sort) {
    case 'newest':
      filtered = filtered.sort((a, b) => Number(b.created_at - a.created_at));
      break;
    case 'price-low':
      filtered = filtered.sort((a, b) => {
        const priceDiff = a.price - b.price;
        return priceDiff !== 0 ? priceDiff : a.id.localeCompare(b.id);
      });
      break;
    case 'price-high':
      filtered = filtered.sort((a, b) => {
        const priceDiff = b.price - a.price;
        return priceDiff !== 0 ? priceDiff : a.id.localeCompare(b.id);
      });
      break;
    case 'relevance':
    default:
      // Keep backend order (already relevance-sorted)
      break;
  }

  return filtered;
}

export const CATEGORIES = [
  'Electronics',
  'Books',
  'Furniture',
  'Clothing',
  'Sports',
  'Other',
];
