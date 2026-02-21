import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActorClient } from './actorClient';
import { queryKeys } from './queries';
import type { Listing } from '../backend';
import { useMockMode } from '../features/listings/mock/mockMode';
import { mockListingsClient } from '../features/listings/mock/mockListingsClient';
import { toast } from 'sonner';
import { Principal } from '@dfinity/principal';
import { useAuth } from '../features/auth/plugin/useAuth';
import { clearAutosuggestCache } from '../features/search/autosuggest/autosuggestCache';

export function useGetListings() {
  const { actor, isFetching: actorFetching } = useActorClient();
  const { isMockMode } = useMockMode();
  const { session } = useAuth();

  // In dev-bypass mode, use mock data
  const shouldUseMock = isMockMode || session.type === 'dev-bypass';

  return useQuery<Listing[]>({
    queryKey: queryKeys.listings.list(),
    queryFn: async () => {
      if (shouldUseMock) {
        return mockListingsClient.getListings();
      }
      if (!actor) throw new Error('Actor not available');
      return actor.getListings();
    },
    enabled: shouldUseMock || (!!actor && !actorFetching),
    retry: 2,
  });
}

export function useGetListingsBySeller(seller: Principal | null) {
  const { actor, isFetching: actorFetching } = useActorClient();
  const { session } = useAuth();
  const { isMockMode } = useMockMode();

  const shouldUseMock = isMockMode || session.type === 'dev-bypass';

  return useQuery<Listing[]>({
    queryKey: queryKeys.listings.bySeller(seller?.toString() || ''),
    queryFn: async () => {
      if (shouldUseMock) {
        // In dev-bypass, return mock listings
        const allListings = await mockListingsClient.getListings();
        return allListings.slice(0, 2); // Return a few mock listings
      }
      if (!actor || !seller) throw new Error('Actor or seller not available');
      return actor.getListingsBySeller(seller);
    },
    enabled: shouldUseMock || (!!actor && !actorFetching && !!seller),
    retry: 2,
  });
}

export function useGetListing(listingId: string) {
  const { actor, isFetching: actorFetching } = useActorClient();
  const { isMockMode } = useMockMode();
  const { session } = useAuth();

  const shouldUseMock = isMockMode || session.type === 'dev-bypass';

  return useQuery<Listing | null>({
    queryKey: queryKeys.listings.detail(listingId),
    queryFn: async () => {
      if (shouldUseMock) {
        return mockListingsClient.getListing(listingId);
      }
      if (!actor) throw new Error('Actor not available');
      return actor.getListing(listingId);
    },
    enabled: (shouldUseMock || (!!actor && !actorFetching)) && !!listingId,
    retry: 2,
  });
}

export function useSearchListings(searchTerm: string) {
  const { actor, isFetching: actorFetching } = useActorClient();
  const { isMockMode } = useMockMode();
  const { session } = useAuth();

  const shouldUseMock = isMockMode || session.type === 'dev-bypass';

  return useQuery<Listing[]>({
    queryKey: queryKeys.listings.search(searchTerm),
    queryFn: async () => {
      if (shouldUseMock) {
        return mockListingsClient.searchListings(searchTerm);
      }
      if (!actor) throw new Error('Actor not available');
      return actor.searchListings(searchTerm);
    },
    enabled: (shouldUseMock || (!!actor && !actorFetching)) && searchTerm.length > 0,
    retry: 2,
  });
}

export function useGetSavedListings() {
  const { actor, isFetching: actorFetching } = useActorClient();
  const { isMockMode } = useMockMode();
  const { session } = useAuth();

  const shouldUseMock = isMockMode || session.type === 'dev-bypass';

  return useQuery<Listing[]>({
    queryKey: queryKeys.listings.saved(),
    queryFn: async () => {
      if (shouldUseMock) {
        return mockListingsClient.getSavedListings();
      }
      if (!actor) throw new Error('Actor not available');
      return actor.getSavedListings();
    },
    enabled: shouldUseMock || (!!actor && !actorFetching),
    retry: 2,
  });
}

export function useSaveListing() {
  const { actor } = useActorClient();
  const queryClient = useQueryClient();
  const { isMockMode } = useMockMode();
  const { session } = useAuth();

  const shouldUseMock = isMockMode || session.type === 'dev-bypass';

  return useMutation({
    mutationFn: async (listingId: string) => {
      if (shouldUseMock) {
        return mockListingsClient.saveListing(listingId);
      }
      if (!actor) throw new Error('Actor not available');
      return actor.saveListing(listingId);
    },
    onMutate: async (listingId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.listings.saved() });
      const previousSaved = queryClient.getQueryData<Listing[]>(queryKeys.listings.saved());
      const listing = queryClient.getQueryData<Listing | null>(queryKeys.listings.detail(listingId));
      if (listing && previousSaved) {
        queryClient.setQueryData<Listing[]>(queryKeys.listings.saved(), [...previousSaved, listing]);
      }
      return { previousSaved };
    },
    onError: (error, listingId, context) => {
      if (context?.previousSaved) {
        queryClient.setQueryData(queryKeys.listings.saved(), context.previousSaved);
      }
      toast.error('Failed to save listing');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.saved() });
    },
    retry: 2,
  });
}

export function useUnsaveListing() {
  const { actor } = useActorClient();
  const queryClient = useQueryClient();
  const { isMockMode } = useMockMode();
  const { session } = useAuth();

  const shouldUseMock = isMockMode || session.type === 'dev-bypass';

  return useMutation({
    mutationFn: async (listingId: string) => {
      if (shouldUseMock) {
        return mockListingsClient.unsaveListing(listingId);
      }
      if (!actor) throw new Error('Actor not available');
      return actor.unsaveListing(listingId);
    },
    onMutate: async (listingId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.listings.saved() });
      const previousSaved = queryClient.getQueryData<Listing[]>(queryKeys.listings.saved());
      if (previousSaved) {
        queryClient.setQueryData<Listing[]>(
          queryKeys.listings.saved(),
          previousSaved.filter((listing) => listing.id !== listingId)
        );
      }
      return { previousSaved };
    },
    onError: (error, listingId, context) => {
      if (context?.previousSaved) {
        queryClient.setQueryData(queryKeys.listings.saved(), context.previousSaved);
      }
      toast.error('Failed to unsave listing');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.saved() });
    },
    retry: 2,
  });
}

export function useAddListing() {
  const { actor } = useActorClient();
  const queryClient = useQueryClient();
  const { isMockMode } = useMockMode();
  const { session } = useAuth();

  const shouldUseMock = isMockMode || session.type === 'dev-bypass';

  return useMutation({
    mutationFn: async (listing: Listing) => {
      if (shouldUseMock) {
        return mockListingsClient.addListing(listing);
      }
      if (!actor) throw new Error('Actor not available');
      return actor.addListing(listing);
    },
    onSuccess: (_, listing) => {
      // Eagerly update caches for immediate visibility
      queryClient.setQueryData<Listing[]>(
        queryKeys.listings.list(),
        (old) => old ? [listing, ...old] : [listing]
      );
      queryClient.setQueryData<Listing | null>(
        queryKeys.listings.detail(listing.id),
        listing
      );
      
      // Invalidate all listing-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.all });
      
      // Clear autosuggest cache so new listing appears in suggestions
      clearAutosuggestCache();
      
      toast.success('Listing created successfully');
    },
    onError: (error) => {
      console.error('Failed to create listing:', error);
      toast.error('Failed to create listing');
    },
    retry: 2,
  });
}

export function useUpdateListing() {
  const { actor } = useActorClient();
  const queryClient = useQueryClient();
  const { isMockMode } = useMockMode();
  const { session } = useAuth();

  const shouldUseMock = isMockMode || session.type === 'dev-bypass';

  return useMutation({
    mutationFn: async ({ listingId, listing }: { listingId: string; listing: Listing }) => {
      if (shouldUseMock) {
        return mockListingsClient.updateListing(listingId, listing);
      }
      if (!actor) throw new Error('Actor not available');
      return actor.updateListing(listingId, listing);
    },
    onSuccess: (_, { listingId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.detail(listingId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.all });
      clearAutosuggestCache();
      toast.success('Listing updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update listing:', error);
      toast.error('Failed to update listing');
    },
    retry: 2,
  });
}

export function useDeleteListing() {
  const { actor } = useActorClient();
  const queryClient = useQueryClient();
  const { isMockMode } = useMockMode();
  const { session } = useAuth();

  const shouldUseMock = isMockMode || session.type === 'dev-bypass';

  return useMutation({
    mutationFn: async (listingId: string) => {
      if (shouldUseMock) {
        return mockListingsClient.deleteListing(listingId);
      }
      if (!actor) throw new Error('Actor not available');
      return actor.deleteListing(listingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.all });
      clearAutosuggestCache();
      toast.success('Listing deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete listing:', error);
      toast.error('Failed to delete listing');
    },
    retry: 2,
  });
}
