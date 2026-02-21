import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Eye } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { ROUTES } from '../../../app/routes';
import type { Listing } from '../../../backend';
import { ListingImage } from '../components/ListingImage';

interface MyListingCardProps {
  listing: Listing;
}

export function MyListingCard({ listing }: MyListingCardProps) {
  const navigate = useNavigate();
  const firstImage = listing.images[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success border-success/20';
      case 'sold':
        return 'bg-muted text-muted-foreground border-muted';
      case 'draft':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="group overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-lg interactive-glow">
      <div className="relative aspect-square overflow-hidden bg-muted">
        {firstImage ? (
          <div className="h-full w-full">
            <ListingImage image={firstImage} alt={listing.title} className="h-full w-full object-cover" lazy={true} />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">No image</div>
        )}
        <Badge className={`absolute left-2 top-2 ${getStatusColor(listing.status)}`}>
          {listing.status}
        </Badge>
      </div>
      <CardContent className="p-3">
        <h3 className="line-clamp-1 font-semibold">{listing.title}</h3>
        <p className="text-lg font-bold text-primary">₹{listing.price}</p>
        <div className="mt-3 flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => navigate({ to: ROUTES.listing(listing.id) })}
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
          <Button
            size="sm"
            variant="default"
            className="flex-1"
            onClick={() => navigate({ to: ROUTES.editListing(listing.id) })}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
