import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetListing, useUpdateListing } from '../api/listings';
import { EditListingForm } from '../features/listings/edit/EditListingForm';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ROUTES } from '../app/routes';
import { AppShell } from '../app/layout/AppShell';
import type { Listing } from '../backend';

export default function EditListingPage() {
  const { listingId } = useParams({ strict: false });
  const navigate = useNavigate();
  const { data: listing, isLoading, error } = useGetListing(listingId || '');
  const updateListingMutation = useUpdateListing();

  const handleSubmit = async (updatedListing: Listing) => {
    if (!listingId) return;

    try {
      await updateListingMutation.mutateAsync({ listingId, listing: updatedListing });
      navigate({ to: ROUTES.listing(listingId) });
    } catch (error) {
      console.error('Failed to update listing:', error);
      toast.error('Failed to update listing. Please try again.');
      throw error;
    }
  };

  const handleCancel = () => {
    if (listingId) {
      navigate({ to: ROUTES.listing(listingId) });
    } else {
      navigate({ to: ROUTES.myListings });
    }
  };

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppShell>
    );
  }

  if (error || !listing) {
    return (
      <AppShell>
        <div className="container mx-auto p-4">
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
            <p className="text-destructive">Failed to load listing. Please try again.</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="container mx-auto max-w-3xl p-4 pb-24">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Edit Listing</h1>
          <p className="text-muted-foreground">Update your listing details</p>
        </div>
        <EditListingForm listing={listing} onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </AppShell>
  );
}
