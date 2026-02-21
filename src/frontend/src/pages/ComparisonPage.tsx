import { useQuery } from '@tanstack/react-query';
import { useActorClient } from '../api/actorClient';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { ROUTES } from '../app/routes';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import type { Listing } from '../backend';
import { ListingImage } from '../features/listings/components/ListingImage';
import { ConditionBadge } from '../features/listings/components/ConditionBadge';
import { SellerRating } from '../features/trustSafety/badges/SellerRating';
import { Skeleton } from '@/components/ui/skeleton';

export default function ComparisonPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { ids?: string };
  const { actor } = useActorClient();

  const listingIds = search.ids ? search.ids.split(',').slice(0, 3) : [];

  const { data: listings, isLoading } = useQuery<Listing[]>({
    queryKey: ['comparisonListings', listingIds],
    queryFn: async () => {
      if (!actor || listingIds.length === 0) return [];
      
      const listingPromises = listingIds.map(id => actor.getListing(id));
      const results = await Promise.all(listingPromises);
      
      return results.filter((listing): listing is Listing => listing !== null);
    },
    enabled: !!actor && listingIds.length > 0,
  });

  const handleRemoveListing = (listingId: string) => {
    const newIds = listingIds.filter(id => id !== listingId);
    if (newIds.length === 0) {
      navigate({ to: ROUTES.search });
      return;
    }
    navigate({ to: ROUTES.compare, search: { ids: newIds.join(',') } });
  };

  const handleExitComparison = () => {
    navigate({ to: ROUTES.search });
  };

  if (listingIds.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6 pb-24">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h2 className="text-xl font-semibold mb-2">No items to compare</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Select 2-3 listings from search to compare them
          </p>
          <Button onClick={() => navigate({ to: ROUTES.search })}>
            Go to Search
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-24 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleExitComparison}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Compare Listings</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Comparing {listings?.length || 0} items
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={handleExitComparison}>
          Exit Comparison
        </Button>
      </div>

      {/* Comparison Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: listingIds.length }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-4">
                <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : listings && listings.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ComparisonCard
              key={listing.id}
              listing={listing}
              onRemove={() => handleRemoveListing(listing.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">Failed to load listings</p>
        </div>
      )}
    </div>
  );
}

interface ComparisonCardProps {
  listing: Listing;
  onRemove: () => void;
}

function ComparisonCard({ listing, onRemove }: ComparisonCardProps) {
  const navigate = useNavigate();
  const firstImage = listing.images[0];

  return (
    <Card className="relative overflow-hidden border-border/40">
      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-background/95 backdrop-blur-md shadow-sm hover:bg-destructive hover:text-destructive-foreground"
      >
        <X className="h-4 w-4" />
      </Button>

      <CardContent className="p-0 space-y-4">
        {/* Image */}
        <div
          className="relative aspect-[4/3] overflow-hidden bg-muted/30 cursor-pointer"
          onClick={() => navigate({ to: ROUTES.listing(listing.id) })}
        >
          {firstImage ? (
            <ListingImage image={firstImage} alt={listing.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground text-sm">
              No image
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-4 space-y-3">
          <h3
            className="font-semibold text-lg leading-snug cursor-pointer hover:text-primary"
            onClick={() => navigate({ to: ROUTES.listing(listing.id) })}
          >
            {listing.title}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-primary">₹{listing.price.toLocaleString()}</p>
            {listing.original_price && listing.original_price > listing.price && (
              <p className="text-sm text-muted-foreground line-through">
                ₹{listing.original_price.toLocaleString()}
              </p>
            )}
          </div>

          {/* Condition */}
          <div>
            <p className="text-xs text-muted-foreground mb-1">Condition</p>
            <ConditionBadge condition={listing.condition} />
          </div>

          {/* Description */}
          <div>
            <p className="text-xs text-muted-foreground mb-1">Description</p>
            <p className="text-sm line-clamp-3">{listing.description}</p>
          </div>

          {/* Seller Rating */}
          <div>
            <p className="text-xs text-muted-foreground mb-1">Seller</p>
            <SellerRating
              rating={listing.trust_indicators.star_rating}
              transactionCount={listing.trust_indicators.transaction_count}
              showCount={true}
            />
          </div>

          {/* Meetup Locations */}
          {listing.meetup_locations && listing.meetup_locations.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Meetup Locations</p>
              <div className="flex flex-wrap gap-1">
                {listing.meetup_locations.slice(0, 3).map((location, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-muted px-2 py-1 rounded-md"
                  >
                    {location.name}
                  </span>
                ))}
                {listing.meetup_locations.length > 3 && (
                  <span className="text-xs text-muted-foreground px-2 py-1">
                    +{listing.meetup_locations.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* View Details Button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate({ to: ROUTES.listing(listing.id) })}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
