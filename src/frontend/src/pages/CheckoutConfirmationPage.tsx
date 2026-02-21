import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { ROUTES } from '../app/routes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Home, User } from 'lucide-react';
import { useCart } from '../features/cart/hooks/useCart';
import { toast } from 'sonner';
import { getCheckoutData, clearCheckoutData } from '../features/checkout/checkoutStorage';

export default function CheckoutConfirmationPage() {
  const navigate = useNavigate();
  const { clear } = useCart();

  // Get order data from sessionStorage
  const orderData = getCheckoutData();
  const sellerGroups = orderData?.sellerGroups || [];
  const grandTotal = orderData?.grandTotal || 0;

  useEffect(() => {
    // Clear cart on successful order
    if (sellerGroups.length > 0) {
      clear();
      toast.success('Order placed successfully!', {
        description: 'This is a demonstration. Payment integration coming soon.',
      });
    } else {
      // No order data, redirect to home
      navigate({ to: ROUTES.home });
    }

    // Cleanup checkout data on unmount
    return () => {
      clearCheckoutData();
    };
  }, [sellerGroups.length, clear, navigate]);

  if (sellerGroups.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-24 space-y-6">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
          <CheckCircle2 className="h-10 w-10 text-success" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Your order has been placed successfully
          </p>
        </div>
      </div>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order Date</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Items</span>
              <span className="font-medium">
                {sellerGroups.reduce((sum, g) => sum + g.listings.length, 0)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Number of Sellers</span>
              <span className="font-medium">{sellerGroups.length}</span>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between text-xl font-bold">
            <span>Total Paid</span>
            <span className="text-primary">₹{grandTotal}</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Split Details */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Payment Distribution</h2>
        {sellerGroups.map((group, idx) => (
          <Card key={idx}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Seller {idx + 1}</p>
                    <p className="text-sm text-muted-foreground">
                      {group.listings.length} item{group.listings.length === 1 ? '' : 's'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">₹{group.subtotal}</p>
                  <Badge variant="secondary" className="text-xs">
                    Auto-routed
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Next Steps */}
      <Card className="bg-muted/50">
        <CardContent className="p-6 space-y-3">
          <h3 className="font-semibold">What's Next?</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Sellers will be notified of your order</li>
            <li>• Coordinate pickup/delivery directly with each seller</li>
            <li>• Meet in public places for safety</li>
            <li>• Verify items before completing the transaction</li>
          </ul>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button 
          className="flex-1" 
          onClick={() => navigate({ to: ROUTES.home })}
        >
          <Home className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>
    </div>
  );
}
