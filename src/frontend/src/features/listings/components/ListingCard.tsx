import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Listing } from '../../../backend';
import { ListingImage } from './ListingImage';
import { useCart } from '../../cart/hooks/useCart';
import { toast } from 'sonner';
import { ConditionBadge } from './ConditionBadge';
import { SellerRating } from '../../trustSafety/badges/SellerRating';

interface ListingCardProps {
  listing?: Listing;
  onSave?: () => void;
  isSaved?: boolean;
  isSaving?: boolean;
  onClick?: () => void;
  skeleton?: boolean;
  isFeatured?: boolean;
}

export const ListingCard = memo(function ListingCard({ 
  listing, 
  onSave, 
  isSaved, 
  isSaving, 
  onClick, 
  skeleton,
  isFeatured = false
}: ListingCardProps) {
  const { isInCart, add: addToCart, remove: removeFromCart } = useCart();

  if (skeleton) {
    return <ListingCardSkeleton />;
  }

  if (!listing) return null;

  const firstImage = listing.images[0];
  const timeAgo = getTimeAgo(Number(listing.created_at) / 1_000_000);
  const inCart = isInCart(listing.id);
  const hasOriginalPrice = listing.original_price && listing.original_price > listing.price;

  const handleCartToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inCart) {
      removeFromCart(listing.id);
      toast.success('Removed from cart');
    } else {
      addToCart(listing.id);
      toast.success('Added to cart');
    }
  };

  return (
    <Card
      className={cn(
        "group cursor-pointer overflow-hidden border-border/40 bg-card shadow-xs motion-safe:transition-all motion-safe:hover:shadow-card motion-safe:hover:-translate-y-1 active:scale-[0.98]",
        isFeatured && "border-primary/40 shadow-primary/10 ring-2 ring-primary/20"
      )}
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted/30">
        {firstImage ? (
          <div className="h-full w-full motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105">
            <ListingImage image={firstImage} alt={listing.title} className="h-full w-full object-cover" lazy={true} />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground text-sm">No image</div>
        )}
        <div className="absolute right-2 top-2 flex gap-1.5">
          {onSave && (
            <Button
              variant="ghost"
              size="icon"
              disabled={isSaving}
              className="h-9 w-9 rounded-full bg-background/95 backdrop-blur-md shadow-sm motion-safe:transition-all motion-safe:hover:scale-110 hover:bg-background active:scale-90 disabled:opacity-50"
              onClick={(e) => {
                e.stopPropagation();
                onSave();
              }}
            >
              <Heart
                className={cn(
                  'h-4 w-4 motion-safe:transition-all',
                  isSaved ? 'fill-destructive text-destructive scale-110' : 'text-foreground'
                )}
              />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full bg-background/95 backdrop-blur-md shadow-sm motion-safe:transition-all motion-safe:hover:scale-110 hover:bg-background active:scale-90"
            onClick={handleCartToggle}
          >
            <ShoppingCart
              className={cn(
                'h-4 w-4 motion-safe:transition-all',
                inCart ? 'fill-primary text-primary scale-110' : 'text-foreground'
              )}
            />
          </Button>
        </div>
        <div className="absolute bottom-2 left-2">
          <ConditionBadge condition={listing.condition} className="backdrop-blur-sm bg-background/90 shadow-sm" />
        </div>
      </div>
      <CardContent className="p-4 space-y-2">
        <h3 className="line-clamp-2 font-semibold text-base leading-snug">{listing.title}</h3>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold text-foreground">₹{listing.price}</p>
          {hasOriginalPrice && (
            <p className="text-sm text-muted-foreground line-through">₹{listing.original_price}</p>
          )}
        </div>
        <SellerRating 
          rating={listing.trust_indicators.star_rating} 
          transactionCount={listing.trust_indicators.transaction_count}
          showCount={false}
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
          <span className="truncate">{listing.hostel}</span>
          <span className="shrink-0 ml-2">{timeAgo}</span>
        </div>
      </CardContent>
    </Card>
  );
});

function ListingCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border/40 bg-card shadow-xs">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted/30">
        <div className="shimmer h-full w-full" />
      </div>
      <CardContent className="p-4 space-y-2">
        <div className="shimmer h-5 w-3/4 rounded" />
        <div className="shimmer h-7 w-1/2 rounded" />
        <div className="shimmer h-4 w-2/3 rounded" />
        <div className="flex items-center justify-between pt-1">
          <div className="shimmer h-3 w-1/3 rounded" />
          <div className="shimmer h-3 w-1/4 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}
