import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from '@tanstack/react-router';
import { ROUTES } from '../../../app/routes';
import { getRecentlyViewed } from '../../../store/persistence/recentlyViewed';
import { useGetListings } from '../../../api/listings';
import { TrendingUp, Eye, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CATEGORIES } from '../../search/searchFiltering';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardWidgetsGrid() {
  const navigate = useNavigate();
  const { data: allListings, isLoading } = useGetListings();
  const recentlyViewed = getRecentlyViewed().slice(0, 3);

  const topCategories = CATEGORIES.slice(0, 4);

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Explore</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {/* Continue Browsing Widget */}
        <Card 
          className="border-border/50 bg-card/80 backdrop-blur-sm cursor-pointer motion-safe:transition-all motion-safe:hover:scale-[1.02] motion-safe:hover:shadow-lg"
          onClick={() => navigate({ to: ROUTES.search })}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Eye className="h-4 w-4 text-primary" />
              Continue Browsing
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentlyViewed.length > 0 ? (
              <div className="space-y-2">
                {recentlyViewed.map((rv, idx) => {
                  const listing = allListings?.find(l => l.id === rv.listingId);
                  return listing ? (
                    <div key={idx} className="text-sm text-muted-foreground truncate">
                      • {listing.title}
                    </div>
                  ) : null;
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recent views yet</p>
            )}
          </CardContent>
        </Card>

        {/* Top Categories Widget */}
        <Card 
          className="border-border/50 bg-card/80 backdrop-blur-sm cursor-pointer motion-safe:transition-all motion-safe:hover:scale-[1.02] motion-safe:hover:shadow-lg"
          onClick={() => navigate({ to: ROUTES.search })}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Tag className="h-4 w-4 text-primary" />
              Top Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {topCategories.map((cat) => (
                <Badge key={cat} variant="secondary" className="text-xs">
                  {cat}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights Teaser Widget */}
        <Card 
          className="border-border/50 bg-card/80 backdrop-blur-sm cursor-pointer motion-safe:transition-all motion-safe:hover:scale-[1.02] motion-safe:hover:shadow-lg"
          onClick={() => navigate({ to: ROUTES.insights })}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-primary" />
              Marketplace Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-12 w-full" />
            ) : (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {allListings?.length || 0} active listings
                </p>
                <p className="text-xs text-muted-foreground">
                  View detailed analytics →
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
