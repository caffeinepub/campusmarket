import { useMemo } from 'react';
import { useGetListings, useGetSavedListings } from '../../../api/listings';
import { useNavigate } from '@tanstack/react-router';
import { ROUTES } from '../../../app/routes';
import { ListingCard } from '../../listings/components/ListingCard';
import { useOptimisticToggleSave } from '../../listings/hooks/useOptimisticToggleSave';
import { getRecentlyViewed } from '../../../store/persistence/recentlyViewed';
import { getRecentSearches } from '../../../store/persistence/recentSearches';
import type { Listing } from '../../../backend';
import { Skeleton } from '@/components/ui/skeleton';

const MAX_PREVIEW_COUNT = 4;

export function PersonalizedListingsPreview() {
  const navigate = useNavigate();
  const { data: allListings, isLoading } = useGetListings();
  const { data: savedListings } = useGetSavedListings();

  const personalizedListings = useMemo(() => {
    if (!allListings) return [];

    const savedIds = new Set(savedListings?.map(l => l.id) || []);
    const recentlyViewedIds = getRecentlyViewed().map(rv => rv.listingId);
    const recentSearches = getRecentSearches();

    // Score listings based on preference signals
    const scored = allListings.map(listing => {
      let score = 0;
      
      // Boost if in recently viewed
      if (recentlyViewedIds.includes(listing.id)) score += 10;
      
      // Boost if matches recent search terms
      recentSearches.forEach(search => {
        if (listing.title.toLowerCase().includes(search.toLowerCase()) ||
            listing.description.toLowerCase().includes(search.toLowerCase())) {
          score += 5;
        }
      });
      
      // Boost if same category as saved items
      savedListings?.forEach(saved => {
        if (saved.category === listing.category && saved.id !== listing.id) {
          score += 3;
        }
      });

      return { listing, score };
    });

    // Filter out already saved, sort by score, take top N
    return scored
      .filter(s => !savedIds.has(s.listing.id))
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_PREVIEW_COUNT)
      .map(s => s.listing);
  }, [allListings, savedListings]);

  if (isLoading) {
    return (
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">For You</h2>
          <p className="text-sm text-muted-foreground">Personalized picks based on your activity</p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: MAX_PREVIEW_COUNT }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      </section>
    );
  }

  if (personalizedListings.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">For You</h2>
        <p className="text-sm text-muted-foreground">Personalized picks based on your activity</p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {personalizedListings.map((listing, index) => (
          <ListingCardWithSave
            key={listing.id}
            listing={listing}
            index={index}
            onClick={() => navigate({ to: ROUTES.listing(listing.id) })}
          />
        ))}
      </div>
    </section>
  );
}

function ListingCardWithSave({ 
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
}
