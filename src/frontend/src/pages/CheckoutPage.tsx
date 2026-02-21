import { useCart } from '../features/cart/hooks/useCart';
import { useGetListings } from '../api/listings';
import { useNavigate } from '@tanstack/react-router';
import { ROUTES } from '../app/routes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, AlertCircle, User } from 'lucide-react';
import { groupCartBySeller } from '../features/checkout/splitBySeller';
import { ListingImage } from '../features/listings/components/ListingImage';
import { setCheckoutData } from '../features/checkout/checkoutStorage';

export default function CheckoutPage() {
  const { cartItems } = useCart();
  const { data: allListings } = useGetListings();
  const navigate = useNavigate();

  const cartListings = allListings?.filter(listing => 
    cartItems.some(item => item.listingId === listing.id)
  ) || [];

  const { sellerGroups, grandTotal } = groupCartBySeller(cartListings);

  const handlePlaceOrder = () => {
    // Store checkout data in sessionStorage for confirmation page
    setCheckoutData({ sellerGroups, grandTotal });
    
    // Navigate to confirmation
    navigate({ to: ROUTES.checkoutConfirmation });
  };

  if (cartListings.length === 0) {
    navigate({ to: ROUTES.cart });
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-24 space-y-6">
      {/* Header */}
      <header className="space-y-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: ROUTES.cart })}
          className="mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
        <p className="text-sm text-muted-foreground">
          Review your order before proceeding
        </p>
      </header>

      {/* Payment Stub Notice */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Payment Integration Coming Soon</AlertTitle>
        <AlertDescription className="text-sm">
          This is a checkout demonstration. Payment will be automatically split between sellers when the payment system is integrated.
        </AlertDescription>
      </Alert>

      {/* Seller Groups */}
      <div className="space-y-6">
        {sellerGroups.map((group, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                Seller {idx + 1}
                <Badge variant="secondary" className="ml-auto">
                  {group.listings.length} item{group.listings.length === 1 ? '' : 's'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {group.listings.map((listing) => (
                <div key={listing.id} className="flex gap-4">
                  <div className="h-16 w-16 flex-shrink-0 rounded overflow-hidden bg-muted">
                    {listing.images[0] ? (
                      <ListingImage 
                        image={listing.images[0]} 
                        alt={listing.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium line-clamp-1">{listing.title}</h4>
                    <p className="text-sm text-muted-foreground">{listing.condition}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{listing.price}</p>
                  </div>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Subtotal to Seller {idx + 1}</span>
                <span className="text-primary">₹{group.subtotal}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Summary */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Order Total</h2>
          <Separator />
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Items</span>
              <span className="font-medium">{cartListings.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Number of Sellers</span>
              <span className="font-medium">{sellerGroups.length}</span>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between text-xl font-bold">
            <span>Grand Total</span>
            <span className="text-primary">₹{grandTotal}</span>
          </div>
          <Button 
            className="w-full" 
            size="lg"
            onClick={handlePlaceOrder}
          >
            Place Order (Stub)
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Payments will be automatically routed to each seller
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
