// Recently Viewed horizontal strip component
import { useQuery } from '@tanstack/react-query';
import { getRecentlyViewed } from '../../../store/persistence/recentlyViewed';
import { useActorClient } from '../../../api/actorClient';
import { ListingCard } from '../../listings/components/ListingCard';
import { useNavigate } from '@tanstack/react-router';
import { ROUTES } from '../../../app/routes';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { Listing } from '../../../backend';

export function RecentlyViewedStrip() {
  const navigate = useNavigate();
  const { actor } = useActorClient();
  const recentlyViewed = getRecentlyViewed();

  const { data: listings, isLoading } = useQuery<Listing[]>({
    queryKey: ['recentlyViewedListings', recentlyViewed.map(r => r.listingId)],
    queryFn: async () => {
      if (!actor) return [];
      const results = await Promise.all(
        recentlyViewed.map(item => actor.getListing(item.listingId))
      );
      return results.filter((l): l is Listing => l !== null);
    },
    enabled: !!actor && recentlyViewed.length > 0,
  });

  if (recentlyViewed.length === 0 || (!isLoading && (!listings || listings.length === 0))) {
    return null;
  }

  return (
    <div className="mb-6">
      <h3 className="mb-3 text-lg font-semibold">Recently Viewed</h3>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-3 pb-2">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-40 shrink-0">
                <ListingCard skeleton />
              </div>
            ))
          ) : (
            listings?.map(listing => (
              <div key={listing.id} className="w-40 shrink-0">
                <ListingCard
                  listing={listing}
                  onClick={() => navigate({ to: ROUTES.listing(listing.id) })}
                />
              </div>
            ))
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
