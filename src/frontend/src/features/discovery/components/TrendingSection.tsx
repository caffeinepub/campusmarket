import { useGetListings } from '../../../api/listings';
import { ListingCard } from '../../listings/components/ListingCard';
import { useNavigate } from '@tanstack/react-router';
import { ROUTES } from '../../../app/routes';
import { useOptimisticToggleSave } from '../../listings/hooks/useOptimisticToggleSave';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { TrendingUp } from 'lucide-react';
import type { Listing } from '../../../backend';

export function TrendingSection() {
  const { data: listings, isLoading } = useGetListings();
  const navigate = useNavigate();

  const trendingListings = listings?.slice(0, 6) || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-warning" />
          <h2 className="text-xl font-bold">Trending Now</h2>
        </div>
        <ScrollArea className="w-full">
          <div className="flex gap-4 pb-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-[160px] shrink-0">
                <ListingCard skeleton />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    );
  }

  if (!trendingListings.length) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-warning" />
        <h2 className="text-xl font-bold">Trending Now</h2>
      </div>
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4">
          {trendingListings.map((listing) => (
            <div key={listing.id} className="w-[160px] shrink-0">
              <TrendingListingCard
                listing={listing}
                onClick={() => navigate({ to: ROUTES.listing(listing.id) })}
              />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

function TrendingListingCard({ listing, onClick }: { listing: Listing; onClick: () => void }) {
  const { isSaved, toggleSave, isLoading } = useOptimisticToggleSave(listing.id);

  return (
    <ListingCard
      listing={listing}
      onClick={onClick}
      onSave={toggleSave}
      isSaved={isSaved}
      isSaving={isLoading}
    />
  );
}
