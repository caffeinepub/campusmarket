import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetListing } from '../api/listings';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Heart, ShoppingCart, MessageSquare, Flag, Share2 } from 'lucide-react';
import { ROUTES } from '../app/routes';
import { toast } from 'sonner';
import { useOptimisticToggleSave } from '../features/listings/hooks/useOptimisticToggleSave';
import { useCart } from '../features/cart/hooks/useCart';
import { ListingImageCarousel } from '../features/listings/components/ListingImageCarousel';
import { SafetyTipsBanner } from '../features/trustSafety/safetyTips/SafetyTipsBanner';
import { ReportBottomSheet } from '../features/trustSafety/report/ReportBottomSheet';
import { useState, useEffect } from 'react';
import { addRecentlyViewed } from '../store/persistence/recentlyViewed';
import { ConditionBadge } from '../features/listings/components/ConditionBadge';
import { ConditionDocumentation } from '../features/listings/components/ConditionDocumentation';
import { MeetupLocationsSection } from '../features/listings/components/MeetupLocationsSection';
import { VerifiedBadge } from '../features/trustSafety/badges/VerifiedBadge';
import { SellerRating } from '../features/trustSafety/badges/SellerRating';

export default function ListingDetailsPage() {
  const { listingId } = useParams({ from: '/protected/listing/$listingId' });
  const navigate = useNavigate();
  const { data: listing, isLoading, error } = useGetListing(listingId);
  const { isSaved, toggleSave, isLoading: isSaving } = useOptimisticToggleSave(listingId);
  const { isInCart, add: addToCart, remove: removeFromCart } = useCart();
  const [isReportOpen, setIsReportOpen] = useState(false);

  const inCart = listing ? isInCart(listing.id) : false;

  useEffect(() => {
    if (listing) {
      addRecentlyViewed(listing.id);
    }
  }, [listing]);

  useEffect(() => {
    if (error) {
      toast.error('Failed to load listing');
      navigate({ to: ROUTES.home });
    }
  }, [error, navigate]);

  if (isLoading) {
    return <ListingDetailsSkeleton />;
  }

  if (!listing) {
    return null;
  }

  const hasOriginalPrice = listing.original_price && listing.original_price > listing.price;

  const handleCartToggle = () => {
    if (inCart) {
      removeFromCart(listing.id);
      toast.success('Removed from cart');
    } else {
      addToCart(listing.id);
      toast.success('Added to cart');
    }
  };

  const handleChat = () => {
    toast.info('Chat feature coming soon');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: listing.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-24 max-w-6xl">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate({ to: ROUTES.search })}
        className="mb-4 -ml-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Search
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Images */}
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-muted/30 shadow-card">
            <ListingImageCarousel images={listing.images} title={listing.title} />
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          {/* Title and Actions */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="text-3xl font-bold leading-tight">{listing.title}</h1>
              <div className="flex gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleSave}
                  disabled={isSaving}
                  className="rounded-full"
                >
                  <Heart className={isSaved ? 'fill-destructive text-destructive' : ''} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                  className="rounded-full"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsReportOpen(true)}
                  className="rounded-full"
                >
                  <Flag className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <p className="text-4xl font-bold text-foreground">₹{listing.price}</p>
              {hasOriginalPrice && (
                <p className="text-xl text-muted-foreground line-through">₹{listing.original_price}</p>
              )}
            </div>

            {/* Condition Badge */}
            <ConditionBadge condition={listing.condition} showIndicator />
          </div>

          <Separator />

          {/* Seller Information */}
          <Card>
            <CardContent className="p-6 space-y-3">
              <h3 className="font-semibold text-lg">Seller Information</h3>
              <div className="flex items-center gap-2">
                <span className="font-medium">{listing.hostel}</span>
                <VerifiedBadge verified={listing.trust_indicators.verified_student} />
              </div>
              <SellerRating
                rating={listing.trust_indicators.star_rating}
                transactionCount={listing.trust_indicators.transaction_count}
              />
              <p className="text-sm text-muted-foreground">
                Reliability Score: {listing.trust_indicators.reliability_score.toFixed(1)}/5.0
              </p>
            </CardContent>
          </Card>

          {/* Primary Actions */}
          <div className="flex gap-3">
            <Button
              size="lg"
              onClick={handleCartToggle}
              className="flex-1 rounded-xl h-12 text-base font-semibold btn-primary"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {inCart ? 'Remove from Cart' : 'Add to Cart'}
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={handleChat}
              className="flex-1 rounded-xl h-12 text-base font-semibold btn-secondary"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Chat with Seller
            </Button>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Description</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {listing.description}
            </p>
          </div>

          {/* Details */}
          <Card>
            <CardContent className="p-6 space-y-3">
              <h3 className="font-semibold text-lg mb-3">Details</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Category</span>
                  <p className="font-medium">{listing.category}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Campus</span>
                  <p className="font-medium">{listing.campus}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Department</span>
                  <p className="font-medium">{listing.department}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Posted</span>
                  <p className="font-medium">{getTimeAgo(Number(listing.created_at) / 1_000_000)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Full Width Sections */}
      <div className="mt-8 space-y-6">
        {/* Condition Documentation */}
        <ConditionDocumentation
          condition={listing.condition}
          defectDescription={listing.defect_description}
        />

        {/* Meetup Locations */}
        <MeetupLocationsSection locations={listing.meetup_locations} />

        {/* Safety Tips */}
        <SafetyTipsBanner />
      </div>

      {/* Report Bottom Sheet */}
      <ReportBottomSheet
        listingId={listing.id}
        open={isReportOpen}
        onOpenChange={setIsReportOpen}
      />
    </div>
  );
}

function ListingDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6 pb-24 max-w-6xl">
      <div className="shimmer h-10 w-32 rounded mb-4" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="shimmer aspect-square rounded-2xl" />
        <div className="space-y-6">
          <div className="shimmer h-10 w-3/4 rounded" />
          <div className="shimmer h-12 w-1/2 rounded" />
          <div className="shimmer h-32 w-full rounded" />
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  return `${days} days ago`;
}
