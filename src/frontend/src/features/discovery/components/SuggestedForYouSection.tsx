// Suggested for You section component
import { useGetListings, useGetSavedListings } from '../../../api/listings';
import { generateSuggestions, hasSufficientSignals } from '../suggestions/heuristics';
import { ListingCard } from '../../listings/components/ListingCard';
import { useNavigate } from '@tanstack/react-router';
import { ROUTES } from '../../../app/routes';
import { useOptimisticToggleSave } from '../../listings/hooks/useOptimisticToggleSave';
import type { Listing } from '../../../backend';

export function SuggestedForYouSection() {
  const navigate = useNavigate();
  const { data: allListings } = useGetListings();
  const { data: savedListings } = useGetSavedListings();

  if (!hasSufficientSignals() || !allListings || allListings.length === 0) {
    return null;
  }

  const savedIds = savedListings?.map(l => l.id) || [];
  const suggestions = generateSuggestions(allListings, savedIds);

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h3 className="mb-3 text-lg font-semibold">Suggested for You</h3>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {suggestions.map((listing, index) => (
          <SuggestionCard key={listing.id} listing={listing} index={index} />
        ))}
      </div>
    </div>
  );
}

function SuggestionCard({ listing, index }: { listing: Listing; index: number }) {
  const navigate = useNavigate();
  const { isSaved, toggleSave, isLoading } = useOptimisticToggleSave(listing.id);

  return (
    <div
      className="animate-in fade-in slide-in-from-bottom-4"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
    >
      <ListingCard
        listing={listing}
        onClick={() => navigate({ to: ROUTES.listing(listing.id) })}
        onSave={toggleSave}
        isSaved={isSaved}
        isSaving={isLoading}
      />
    </div>
  );
}
