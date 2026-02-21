import type { Listing, ProductCondition } from '../../../backend';

export type SortOption = 
  | 'relevance'
  | 'price-low'
  | 'price-high'
  | 'newest'
  | 'popularity'
  | 'condition'
  | 'distance';

export interface SortOptionConfig {
  value: SortOption;
  label: string;
}

export const SORT_OPTIONS: SortOptionConfig[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'popularity', label: 'Most Popular' },
  { value: 'condition', label: 'Best Condition' },
  { value: 'distance', label: 'Nearest First' },
];

export function applySorting(listings: Listing[], sort: SortOption, searchTerm?: string): Listing[] {
  const sorted = [...listings];

  switch (sort) {
    case 'relevance':
      if (searchTerm) {
        // Sort by relevance to search term
        return sorted.sort((a, b) => {
          const aScore = getRelevanceScore(a, searchTerm);
          const bScore = getRelevanceScore(b, searchTerm);
          return bScore - aScore;
        });
      }
      return sorted;

    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);

    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);

    case 'newest':
      return sorted.sort((a, b) => Number(b.created_at - a.created_at));

    case 'popularity':
      return sorted.sort((a, b) => {
        const aScore = a.trust_indicators.star_rating * Number(a.trust_indicators.transaction_count);
        const bScore = b.trust_indicators.star_rating * Number(b.trust_indicators.transaction_count);
        return bScore - aScore;
      });

    case 'condition':
      return sorted.sort((a, b) => {
        const conditionOrder = { likeNew: 4, good: 3, fair: 2, wellUsed: 1 };
        const aScore = conditionOrder[a.condition as keyof typeof conditionOrder] || 0;
        const bScore = conditionOrder[b.condition as keyof typeof conditionOrder] || 0;
        return bScore - aScore;
      });

    case 'distance':
      // Placeholder: sort by hostel name alphabetically as proxy for distance
      return sorted.sort((a, b) => a.hostel.localeCompare(b.hostel));

    default:
      return sorted;
  }
}

function getRelevanceScore(listing: Listing, searchTerm: string): number {
  const term = searchTerm.toLowerCase();
  let score = 0;

  if (listing.title.toLowerCase().includes(term)) score += 10;
  if (listing.description.toLowerCase().includes(term)) score += 5;
  if (listing.category.toLowerCase().includes(term)) score += 3;

  return score;
}
