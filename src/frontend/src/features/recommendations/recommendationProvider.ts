// Single recommendation-provider abstraction
import type { Listing } from '../../backend';
import { computeTrendingFeed, computeRecommendedFeed } from '../discovery/feeds/feedHeuristics';

export type RecommendationType = 'personalized' | 'trending' | 'similarCategory' | 'collaborative';

export interface RecommendationRequest {
  type: RecommendationType;
  allListings: Listing[];
  savedListingIds: string[];
  contextListing?: Listing;
  limit: number;
}

export interface RecommendationResponse {
  listings: Listing[];
  type: RecommendationType;
  source: 'heuristic' | 'external';
}

// Default to heuristic mode (no external network calls)
export function fetchRecommendations(request: RecommendationRequest): RecommendationResponse {
  let listings: Listing[] = [];

  switch (request.type) {
    case 'trending':
      listings = computeTrendingFeed(request.allListings, request.limit);
      break;
    case 'personalized':
    case 'collaborative':
      listings = computeRecommendedFeed(request.allListings, request.savedListingIds, request.limit);
      break;
    case 'similarCategory':
      if (request.contextListing) {
        listings = request.allListings
          .filter(l => l.category === request.contextListing!.category && l.id !== request.contextListing!.id && l.status === 'active')
          .slice(0, request.limit);
      }
      break;
  }

  return {
    listings,
    type: request.type,
    source: 'heuristic',
  };
}
