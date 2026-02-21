import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ShoppingCart, Package } from 'lucide-react';
import { ROUTES } from '../../../app/routes';
import { useGetSavedListings } from '../../../api/listings';
import { useCart } from '../../cart/hooks/useCart';

export function DashboardStatsRow() {
  const navigate = useNavigate();
  const { data: savedListings } = useGetSavedListings();
  const { cartCount } = useCart();

  const stats = [
    {
      id: 'saved',
      label: 'Saved',
      value: savedListings?.length || 0,
      icon: Heart,
      path: ROUTES.saved,
      color: 'text-destructive',
    },
    {
      id: 'cart',
      label: 'Cart',
      value: cartCount,
      icon: ShoppingCart,
      path: ROUTES.cart,
      color: 'text-accent',
    },
    {
      id: 'listings',
      label: 'My Listings',
      value: 0,
      icon: Package,
      path: ROUTES.myListings,
      color: 'text-primary',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.id}
            className="cursor-pointer border-border/40 bg-card shadow-xs motion-safe:transition-all motion-safe:hover:shadow-soft motion-safe:hover:-translate-y-0.5 active:scale-95"
            onClick={() => navigate({ to: stat.path })}
          >
            <CardContent className="p-4 flex flex-col items-center gap-2">
              <Icon className={`h-5 w-5 ${stat.color}`} />
              <div className="text-center">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-2xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
