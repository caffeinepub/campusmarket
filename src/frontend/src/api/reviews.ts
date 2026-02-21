import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActorClient } from './actorClient';
import { queryKeys } from './queries';
import type { Review, SellerReview, ProductReview, ProductCondition } from '../backend';
import { Principal } from '@icp-sdk/core/principal';

export function useGetSellerReviews(listingId: string) {
  const { actor, isFetching: actorFetching } = useActorClient();

  return useQuery<SellerReview | null>({
    queryKey: queryKeys.reviews.seller(listingId),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSellerReviews(listingId);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetProductReviews(listingId: string) {
  const { actor, isFetching: actorFetching } = useActorClient();

  return useQuery<ProductReview | null>({
    queryKey: queryKeys.reviews.product(listingId),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getProductReviews(listingId);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddSellerReview() {
  const { actor } = useActorClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      listingId,
      seller,
      review,
    }: {
      listingId: string;
      seller: Principal;
      review: Review;
    }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addSellerReview(listingId, seller, review);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.seller(variables.listingId) });
    },
  });
}

export function useAddProductReview() {
  const { actor } = useActorClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      listingId,
      seller,
      review,
      productCondition,
    }: {
      listingId: string;
      seller: Principal;
      review: Review;
      productCondition: ProductCondition;
    }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addProductReview(listingId, seller, review, productCondition);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.product(variables.listingId) });
    },
  });
}
