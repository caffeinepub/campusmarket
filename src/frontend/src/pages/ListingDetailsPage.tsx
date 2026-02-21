import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetListing } from '../api/listings';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Heart, MessageCircle, Flag, ShoppingCart, MapPin } from 'lucide-react';
import { ROUTES } from '../app/routes';
import { ListingImageCarousel } from '../features/listings/components/ListingImageCarousel';
import { useOptimisticToggleSave } from '../features/listings/hooks/useOptimisticToggleSave';
import { useState, useEffect } from 'react';
import { ReportBottomSheet } from '../features/trustSafety/report/ReportBottomSheet';
import { BadgesRow } from '../features/trustSafety/badges/BadgesRow';
import { SafetyTipsBanner } from '../features/trustSafety/safetyTips/SafetyTipsBanner';
import { addRecentlyViewed } from '../store/persistence/recentlyViewed';
import { toast } from 'sonner';
import { useAuth } from '../features/auth/plugin/useAuth';
import { useCart } from '../features/cart/hooks/useCart';

const CAMPUS_MEETUP_LOCATIONS = [
  { name: 'Main Library', icon: '📚' },
  { name: 'Student Center', icon: '🏛️' },
  { name: 'Main Quad', icon: '🌳' },
  { name: 'Dining Hall', icon: '🍽️' },
];

export default function ListingDetailsPage() {
  const { listingId } = useParams({ from: '/protected/listing/$listingId' });
  const navigate = useNavigate();
  const { session } = useAuth();
  const { data: listing, isLoading, error } = useGetListing(listingId);
  const { isSaved, toggleSave, isLoading: isSaving } = useOptimisticToggleSave(listingId);
  const { isInCart, add: addToCart, remove: removeFromCart } = useCart();
  const [reportOpen, setReportOpen] = useState(false);

  const isDevBypass = session.type === 'dev-bypass';
  const inCart = isInCart(listingId);

  useEffect(() => {
    if (listing) {
      addRecentlyViewed(listingId);
    }
  }, [listing, listingId]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 pb-24">
        <div className="shimmer mb-4 h-8 w-32 rounded-xl" />
        <div className="shimmer mb-6 h-[400px] w-full rounded-2xl" />
        <div className="shimmer mb-2 h-6 w-3/4 rounded" />
        <div className="shimmer h-4 w-1/2 rounded" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="container mx-auto px-4 py-6 pb-24">
        <Button variant="ghost" onClick={() => navigate({ to: ROUTES.home })} className="rounded-xl">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="mt-8 text-center">
          <p className="text-lg font-semibold">Listing not found</p>
          <p className="text-sm text-muted-foreground">This listing may have been removed</p>
        </div>
      </div>
    );
  }

  const handleChat = () => {
    if (isDevBypass) {
      toast.info('Chat is disabled in dev-bypass mode', {
        description: 'Sign in with a real account to message sellers',
      });
      return;
    }
    navigate({ to: ROUTES.chats });
  };

  const handleReport = () => {
    if (isDevBypass) {
      toast.info('Report is disabled in dev-bypass mode', {
        description: 'Sign in with a real account to report listings',
      });
      return;
    }
    setReportOpen(true);
  };

  const handleCartToggle = () => {
    if (inCart) {
      removeFromCart(listingId);
      toast.success('Removed from cart');
    } else {
      addToCart(listingId);
      toast.success('Added to cart');
    }
  };

  const timeAgo = getTimeAgo(Number(listing.created_at) / 1_000_000);

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="container mx-auto px-4 py-6">
        {/* Back button */}
        <Button variant="ghost" onClick={() => navigate({ to: ROUTES.home })} className="mb-6 rounded-xl">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Image Carousel */}
        {listing.images.length > 0 && (
          <div className="mb-6 rounded-2xl overflow-hidden shadow-soft">
            <ListingImageCarousel images={listing.images} title={listing.title} />
          </div>
        )}

        {/* Listing Details */}
        <Card className="mb-6 border-border/40 bg-card shadow-soft rounded-2xl overflow-hidden">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="mb-3 text-2xl font-bold leading-tight">{listing.title}</h1>
                <p className="text-3xl font-bold text-foreground">₹{listing.price}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleSave}
                  disabled={isSaving}
                  className="interactive-press rounded-xl h-11 w-11 border-border/50 motion-safe:transition-all hover:scale-105 active:scale-95"
                >
                  <Heart className={isSaved ? 'fill-destructive text-destructive' : ''} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCartToggle}
                  className="interactive-press rounded-xl h-11 w-11 border-border/50 motion-safe:transition-all hover:scale-105 active:scale-95"
                >
                  <ShoppingCart className={inCart ? 'fill-accent text-accent' : ''} />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="rounded-lg px-3 py-1">{listing.condition}</Badge>
              <Badge variant="outline" className="rounded-lg px-3 py-1">{listing.category}</Badge>
              <Badge variant="outline" className="rounded-lg px-3 py-1">{timeAgo}</Badge>
            </div>

            <div>
              <h2 className="mb-3 text-lg font-semibold">Description</h2>
              <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">{listing.description}</p>
            </div>

            <div>
              <h2 className="mb-3 text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Location
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">Campus:</span>
                  <span className="text-muted-foreground">{listing.campus}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">Hostel:</span>
                  <span className="text-muted-foreground">{listing.hostel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">Department:</span>
                  <span className="text-muted-foreground">{listing.department}</span>
                </div>
              </div>
            </div>

            {/* Meetup Locations */}
            <div>
              <h2 className="mb-3 text-lg font-semibold">Suggested Meetup Spots</h2>
              <div className="grid grid-cols-2 gap-2">
                {CAMPUS_MEETUP_LOCATIONS.map((location) => (
                  <Button
                    key={location.name}
                    variant="outline"
                    className="justify-start rounded-xl border-border/50 h-auto py-3 px-4 motion-safe:transition-all hover:bg-muted/50"
                  >
                    <span className="mr-2 text-lg">{location.icon}</span>
                    <span className="text-sm">{location.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Seller Badges */}
            <div>
              <h2 className="mb-3 text-lg font-semibold">Seller Info</h2>
              <BadgesRow />
            </div>
          </CardContent>
        </Card>

        {/* Safety Tips Banner */}
        <SafetyTipsBanner />
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-20 left-0 right-0 border-t border-border/50 bg-background/95 backdrop-blur-md p-4 shadow-[0_-2px_12px_-2px_rgba(0,0,0,0.08)]">
        <div className="container mx-auto flex gap-3">
          <Button
            variant="outline"
            onClick={handleReport}
            className="interactive-press flex-1 rounded-xl border-border/50 motion-safe:transition-all hover:shadow-soft"
          >
            <Flag className="mr-2 h-4 w-4" />
            Report
          </Button>
          <Button
            onClick={handleChat}
            className="interactive-press flex-1 rounded-xl motion-safe:transition-all hover:shadow-glow"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Message Seller
          </Button>
        </div>
      </div>

      {/* Report Bottom Sheet */}
      <ReportBottomSheet
        open={reportOpen}
        onOpenChange={setReportOpen}
        listingId={listingId}
      />
    </div>
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
