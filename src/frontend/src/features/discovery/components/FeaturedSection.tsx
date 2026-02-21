import { useQuery } from '@tanstack/react-query';
import { useActorClient } from '../../../api/actorClient';
import { ListingCard } from '../../listings/components/ListingCard';
import { useNavigate } from '@tanstack/react-router';
import { ROUTES } from '../../../app/routes';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Sparkles } from 'lucide-react';
import { ListingStatus, type Listing } from '../../../backend';
import { useOptimisticToggleSave } from '../../listings/hooks/useOptimisticToggleSave';

export function FeaturedSection() {
  const navigate = useNavigate();
  const { actor } = useActorClient();

  const { data: allListings, isLoading } = useQuery<Listing[]>({
    queryKey: ['featuredListings'],
    queryFn: async () => {
      if (!actor) return [];
      const listings = await actor.getListings();
      // Get top 5 listings by rating and transaction count
      return listings
        .filter(l => l.status === ListingStatus.active)
        .sort((a, b) => {
          const scoreA = a.trust_indicators.star_rating * Number(a.trust_indicators.transaction_count);
          const scoreB = b.trust_indicators.star_rating * Number(b.trust_indicators.transaction_count);
          return scoreB - scoreA;
        })
        .slice(0, 5);
    },
    enabled: !!actor,
  });

  if (!isLoading && (!allListings || allListings.length === 0)) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary fill-primary/20" />
        <h2 className="text-2xl font-bold">Featured Listings</h2>
      </div>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-4 pb-2">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-72 shrink-0">
                <ListingCard skeleton />
              </div>
            ))
          ) : (
            allListings?.map(listing => (
              <div key={listing.id} className="w-72 shrink-0">
                <FeaturedListingCard listing={listing} />
              </div>
            ))
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}

function FeaturedListingCard({ listing }: { listing: Listing }) {
  const navigate = useNavigate();
  const { isSaved, toggleSave, isLoading } = useOptimisticToggleSave(listing.id);

  return (
    <div className="relative">
      <div className="absolute -top-2 -right-2 z-10 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full shadow-md">
        Featured
      </div>
      <ListingCard
        listing={listing}
        isSaved={isSaved}
        isSaving={isLoading}
        onSave={toggleSave}
        onClick={() => navigate({ to: ROUTES.listing(listing.id) })}
        isFeatured
      />
    </div>
  );
}
