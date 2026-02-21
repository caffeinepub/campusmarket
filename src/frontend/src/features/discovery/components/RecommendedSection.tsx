import { useGetListings } from '../../../api/listings';
import { ListingCard } from '../../listings/components/ListingCard';
import { useNavigate } from '@tanstack/react-router';
import { ROUTES } from '../../../app/routes';
import { useOptimisticToggleSave } from '../../listings/hooks/useOptimisticToggleSave';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Sparkles } from 'lucide-react';
import type { Listing } from '../../../backend';

export function RecommendedSection() {
  const { data: listings, isLoading } = useGetListings();
  const navigate = useNavigate();

  const recommendedListings = listings?.slice(6, 12) || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <h2 className="text-xl font-bold">Recommended for You</h2>
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

  if (!recommendedListings.length) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-accent" />
        <h2 className="text-xl font-bold">Recommended for You</h2>
      </div>
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4">
          {recommendedListings.map((listing) => (
            <div key={listing.id} className="w-[160px] shrink-0">
              <RecommendedListingCard
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

function RecommendedListingCard({ listing, onClick }: { listing: Listing; onClick: () => void }) {
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
