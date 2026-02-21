import { useState, useMemo, memo } from 'react';
import { useGetSavedListings } from '../api/listings';
import { ListingCard } from '../features/listings/components/ListingCard';
import { useNavigate } from '@tanstack/react-router';
import { ROUTES } from '../app/routes';
import { useOptimisticToggleSave } from '../features/listings/hooks/useOptimisticToggleSave';
import { SavedToolbar } from '../features/saved/SavedToolbar';
import { applySavedFilters, type SavedFilters } from '../features/saved/savedSortingFiltering';
import type { Listing } from '../backend';
import { Button } from '@/components/ui/button';
import { Search, Package } from 'lucide-react';
import { toast } from 'sonner';
import { userFacingError } from '../utils/userFacingError';

export default function SavedPage() {
  const { data: savedListings, isLoading, isError, error } = useGetSavedListings();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<SavedFilters>({ sort: 'recent' });

  // Apply filters with memoization
  const filteredListings = useMemo(() => {
    if (!savedListings) return [];
    return applySavedFilters(savedListings, filters);
  }, [savedListings, filters]);

  if (isError && error) {
    toast.error('Failed to load saved listings', {
      description: userFacingError(error),
    });
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-24 space-y-6">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Saved Items</h1>
        <p className="text-sm text-muted-foreground">
          {savedListings ? `${savedListings.length} saved item${savedListings.length === 1 ? '' : 's'}` : 'Loading...'}
        </p>
      </header>

      {/* Toolbar */}
      {savedListings && savedListings.length > 0 && (
        <SavedToolbar filters={filters} onFiltersChange={setFilters} />
      )}

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ListingCard key={i} skeleton />
          ))}
        </div>
      ) : filteredListings.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filteredListings.map((listing, index) => (
            <MemoizedSavedListingCard
              key={listing.id}
              listing={listing}
              index={index}
              onClick={() => navigate({ to: ROUTES.listing(listing.id) })}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center space-y-4 max-w-md">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">No saved items yet</h3>
              <p className="text-sm text-muted-foreground">
                Start saving items you're interested in to view them here later
              </p>
            </div>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => navigate({ to: ROUTES.search })}>
                <Search className="h-4 w-4 mr-2" />
                Browse Listings
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const SavedListingCard = memo(function SavedListingCard({ 
  listing, 
  index, 
  onClick 
}: { 
  listing: Listing; 
  index: number; 
  onClick: () => void;
}) {
  const { isSaved, toggleSave, isLoading } = useOptimisticToggleSave(listing.id);

  return (
    <div
      className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4"
      style={{ 
        animationDelay: `${index * 30}ms`, 
        animationFillMode: 'backwards',
        animationDuration: '300ms'
      }}
    >
      <ListingCard
        listing={listing}
        onClick={onClick}
        onSave={toggleSave}
        isSaved={isSaved}
        isSaving={isLoading}
      />
    </div>
  );
});

const MemoizedSavedListingCard = memo(SavedListingCard);
