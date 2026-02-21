import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetListingsBySeller } from '../api/listings';
import { MyListingCard } from '../features/listings/myListings/MyListingCard';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { ROUTES } from '../app/routes';
import { toast } from 'sonner';

export default function MyListingsPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const principal = identity?.getPrincipal();
  const { data: listings, isLoading, error } = useGetListingsBySeller(principal!);

  if (!identity || !principal) {
    return (
      <div className="container mx-auto p-4 pb-24">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
          <p className="text-destructive">Please log in to view your listings</p>
        </div>
      </div>
    );
  }

  if (error) {
    toast.error('Failed to load your listings');
  }

  return (
    <div className="container mx-auto p-4 pb-24">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Listings</h1>
          <p className="text-muted-foreground">Manage your posted items</p>
        </div>
        <Button onClick={() => navigate({ to: ROUTES.sell })} className="interactive-press">
          <Plus className="mr-2 h-4 w-4" />
          New Listing
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
          <p className="text-destructive">Failed to load listings. Please try again.</p>
        </div>
      )}

      {!isLoading && listings && listings.length === 0 && (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
            <Plus className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-xl font-semibold">No listings yet</h3>
          <p className="mb-6 text-muted-foreground">Start selling by creating your first listing</p>
          <Button onClick={() => navigate({ to: ROUTES.sell })}>
            <Plus className="mr-2 h-4 w-4" />
            Create Listing
          </Button>
        </div>
      )}

      {listings && listings.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing, index) => (
            <div
              key={listing.id}
              style={{
                animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`,
              }}
            >
              <MyListingCard listing={listing} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
