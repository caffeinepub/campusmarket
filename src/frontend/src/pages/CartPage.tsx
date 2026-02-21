import { useCart } from '../features/cart/hooks/useCart';
import { useGetListings } from '../api/listings';
import { useNavigate } from '@tanstack/react-router';
import { ROUTES } from '../app/routes';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2, ShoppingBag, AlertCircle } from 'lucide-react';
import { ListingImage } from '../features/listings/components/ListingImage';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

export default function CartPage() {
  const { cartItems, cartCount, remove, clear } = useCart();
  const { data: allListings, isLoading } = useGetListings();
  const navigate = useNavigate();

  const cartListings = allListings?.filter(listing => 
    cartItems.some(item => item.listingId === listing.id)
  ) || [];

  const total = cartListings.reduce((sum, listing) => sum + listing.price, 0);

  const handleRemove = (listingId: string) => {
    remove(listingId);
    toast.success('Removed from cart');
  };

  const handleClearCart = () => {
    clear();
    toast.success('Cart cleared');
  };

  const handleCheckout = () => {
    if (cartListings.length === 0) return;
    navigate({ to: ROUTES.checkout });
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-24 space-y-6">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
        <p className="text-sm text-muted-foreground">
          {cartCount} item{cartCount === 1 ? '' : 's'} in your cart
        </p>
      </header>

      {/* Safety Banner */}
      {cartListings.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Safety reminder:</strong> Meet in public places and verify items before payment. This is a checkout stub for demonstration.
          </AlertDescription>
        </Alert>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="shimmer h-20 w-20 rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="shimmer h-4 w-3/4 rounded" />
                    <div className="shimmer h-4 w-1/2 rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : cartListings.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartListings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div 
                      className="h-20 w-20 flex-shrink-0 rounded overflow-hidden bg-muted cursor-pointer motion-safe:transition-transform motion-safe:hover:scale-105"
                      onClick={() => navigate({ to: ROUTES.listing(listing.id) })}
                    >
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
                      <h3 
                        className="font-semibold line-clamp-1 cursor-pointer hover:text-primary motion-safe:transition-colors"
                        onClick={() => navigate({ to: ROUTES.listing(listing.id) })}
                      >
                        {listing.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{listing.description}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-lg font-bold text-primary">₹{listing.price}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove(listing.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {cartListings.length > 1 && (
              <Button
                variant="outline"
                onClick={handleClearCart}
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            )}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold">Order Summary</h2>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₹{total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Items</span>
                    <span className="font-medium">{cartListings.length}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{total}</span>
                </div>
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleCheckout}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Proceed to Checkout
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Payment will be split between sellers
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center space-y-4 max-w-md">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground">
                Add items to your cart to get started
              </p>
            </div>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => navigate({ to: ROUTES.home })}>
                Browse Listings
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
