// Saved items preview strip for Home dashboard
import { useGetSavedListings } from '../../../api/listings';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { ROUTES } from '../../../app/routes';

export function SavedItemsStrip() {
  const { data: savedListings, isLoading } = useGetSavedListings();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card className="mb-6 border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="h-5 w-5" />
            Saved Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="shimmer h-32 w-full rounded" />
        </CardContent>
      </Card>
    );
  }

  if (!savedListings || savedListings.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6 border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Heart className="h-5 w-5 fill-destructive text-destructive" />
          Saved Items
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-3">
            {savedListings.map((listing) => (
              <div
                key={listing.id}
                className="inline-block w-32 cursor-pointer transition-transform hover:scale-105"
                onClick={() => navigate({ to: ROUTES.listing(listing.id) })}
              >
                <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                  {listing.images[0] ? (
                    <img
                      src={listing.images[0].url}
                      alt={listing.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>
                <p className="mt-1 truncate text-xs font-medium">{listing.title}</p>
                <p className="text-xs font-semibold text-primary">₹{listing.price}</p>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
