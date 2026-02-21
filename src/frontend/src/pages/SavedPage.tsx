import { useState, useMemo } from 'react';
import { useGetSavedListings } from '../api/listings';
import { ListingCard } from '../features/listings/components/ListingCard';
import { useNavigate } from '@tanstack/react-router';
import { ROUTES } from '../app/routes';
import { useOptimisticToggleSave } from '../features/listings/hooks/useOptimisticToggleSave';
import { SavedToolbar } from '../features/saved/SavedToolbar';
import { applySavedFilters, type SavedFilters } from '../features/saved/savedSortingFiltering';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import type { Listing } from '../backend';

export default function SavedPage() {
  const { data: savedListings, isLoading } = useGetSavedListings();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<SavedFilters>({ sort: 'newest' });

  const filteredListings = useMemo(() => {
    if (!savedListings) return [];
    return applySavedFilters(savedListings, filters);
  }, [savedListings, filters]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 pb-24">
        <h1 className="text-3xl font-bold mb-6">Saved Items</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <ListingCard key={i} skeleton />
          ))}
        </div>
      </div>
    );
  }

  if (!savedListings || savedListings.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6 pb-24">
        <h1 className="text-3xl font-bold mb-6">Saved Items</h1>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No saved items yet</h2>
          <p className="text-muted-foreground mb-6">
            Start saving items you're interested in to view them here
          </p>
          <Button onClick={() => navigate({ to: ROUTES.home })}>Browse Listings</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-24">
      <h1 className="text-3xl font-bold mb-6">Saved Items</h1>

      <div className="mb-6">
        <SavedToolbar filters={filters} onFiltersChange={setFilters} />
      </div>

      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          {filteredListings.length} {filteredListings.length === 1 ? 'item' : 'items'} saved
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredListings.map((listing) => (
          <SavedListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}

function SavedListingCard({ listing }: { listing: Listing }) {
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
