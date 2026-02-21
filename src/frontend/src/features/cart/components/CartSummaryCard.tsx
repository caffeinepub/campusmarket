import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useGetListings } from '../../../api/listings';
import { useNavigate } from '@tanstack/react-router';
import { ROUTES } from '../../../app/routes';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ListingImage } from '../../listings/components/ListingImage';

export function CartSummaryCard() {
  const { cartItems, cartCount, remove } = useCart();
  const { data: allListings } = useGetListings();
  const navigate = useNavigate();

  const cartListings = allListings?.filter(listing => 
    cartItems.some(item => item.listingId === listing.id)
  ) || [];

  const total = cartListings.reduce((sum, listing) => sum + listing.price, 0);

  if (cartCount === 0) {
    return (
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShoppingCart className="h-5 w-5" />
            Cart
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <ShoppingCart className="h-10 w-10 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">Your cart is empty</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Cart ({cartCount})
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: ROUTES.cart })}
          >
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <ScrollArea className="h-[200px]">
          <div className="space-y-2 pr-4">
            {cartListings.slice(0, 5).map((listing) => (
              <div 
                key={listing.id} 
                className="flex gap-3 p-2 rounded-lg hover:bg-muted/50 motion-safe:transition-colors cursor-pointer"
                onClick={() => navigate({ to: ROUTES.listing(listing.id) })}
              >
                <div className="h-12 w-12 flex-shrink-0 rounded overflow-hidden bg-muted">
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
                  <p className="font-medium text-sm line-clamp-1">{listing.title}</p>
                  <p className="text-sm font-semibold text-primary">₹{listing.price}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(listing.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="pt-3 border-t space-y-2">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-primary">₹{total}</span>
          </div>
          <Button 
            className="w-full" 
            onClick={() => navigate({ to: ROUTES.cart })}
          >
            View Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
