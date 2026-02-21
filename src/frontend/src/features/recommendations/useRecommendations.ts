// Hook for UI to retrieve recommendations
import { useMemo } from 'react';
import { useGetListings, useGetSavedListings } from '../../api/listings';
import { fetchRecommendations, type RecommendationType, type RecommendationResponse } from './recommendationProvider';
import type { Listing } from '../../backend';

export function useRecommendations(type: RecommendationType, limit: number = 8, contextListing?: Listing) {
  const { data: allListings, isLoading: listingsLoading } = useGetListings();
  const { data: savedListings, isLoading: savedLoading } = useGetSavedListings();

  const recommendations = useMemo((): RecommendationResponse => {
    if (!allListings) {
      return {
        listings: [],
        type,
        source: 'heuristic',
      };
    }

    const savedIds = savedListings?.map(l => l.id) || [];

    return fetchRecommendations({
      type,
      allListings,
      savedListingIds: savedIds,
      contextListing,
      limit,
    });
  }, [allListings, savedListings, type, limit, contextListing]);

  return {
    recommendations: recommendations.listings,
    source: recommendations.source,
    isLoading: listingsLoading || savedLoading,
  };
}
