import { useQuery } from '@tanstack/react-query';
import { useActorClient } from '../api/actorClient';
import { ListingCard } from '../features/listings/components/ListingCard';
import { useNavigate } from '@tanstack/react-router';
import { ROUTES } from '../app/routes';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { getRecentlyViewed, clearRecentlyViewed } from '../store/persistence/recentlyViewed';
import { useOptimisticToggleSave } from '../features/listings/hooks/useOptimisticToggleSave';
import type { Listing } from '../backend';
import { Skeleton } from '@/components/ui/skeleton';

export default function RecentlyViewedPage() {
  const navigate = useNavigate();
  const { actor } = useActorClient();
  const recentlyViewedItems = getRecentlyViewed();
  const recentlyViewedIds = recentlyViewedItems.map(item => item.listingId);

  const { data: listings, isLoading, refetch } = useQuery<Listing[]>({
    queryKey: ['recentlyViewedListings', recentlyViewedIds],
    queryFn: async () => {
      if (!actor || recentlyViewedIds.length === 0) return [];
      
      const listingPromises = recentlyViewedIds.map(id => actor.getListing(id));
      const results = await Promise.all(listingPromises);
      
      return results.filter((listing): listing is Listing => listing !== null);
    },
    enabled: !!actor && recentlyViewedIds.length > 0,
  });

  const handleClearHistory = () => {
    clearRecentlyViewed();
    toast.success('Recently viewed history cleared');
    refetch();
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-24 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recently Viewed</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {recentlyViewedIds.length} {recentlyViewedIds.length === 1 ? 'item' : 'items'}
          </p>
        </div>
        {recentlyViewedIds.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearHistory}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear History
          </Button>
        )}
      </div>

      {/* Listings Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="aspect-[4/3] w-full rounded-lg mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : listings && listings.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {listings.map((listing) => (
            <RecentlyViewedListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted/50 p-6 mb-4">
            <svg
              className="h-12 w-12 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">No recently viewed items</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Items you view will appear here for easy access
          </p>
          <Button onClick={() => navigate({ to: ROUTES.search })}>
            Browse Listings
          </Button>
        </div>
      )}
    </div>
  );
}

function RecentlyViewedListingCard({ listing }: { listing: Listing }) {
  const navigate = useNavigate();
  const { isSaved, toggleSave, isLoading } = useOptimisticToggleSave(listing.id);

  return (
    <ListingCard
      listing={listing}
      isSaved={isSaved}
      isSaving={isLoading}
      onSave={toggleSave}
      onClick={() => navigate({ to: ROUTES.listing(listing.id) })}
    />
  );
}
