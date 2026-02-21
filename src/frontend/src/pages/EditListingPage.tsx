import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetListing, useUpdateListing } from '../api/listings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { EditListingForm } from '../features/listings/edit/EditListingForm';
import { ROUTES } from '../app/routes';
import { toast } from 'sonner';
import type { Listing } from '../backend';

export default function EditListingPage() {
  const { listingId } = useParams({ from: '/protected/listing/$listingId/edit' });
  const navigate = useNavigate();
  const { data: listing, isLoading, error } = useGetListing(listingId);
  const updateListing = useUpdateListing();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-destructive">Failed to load listing</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (updatedListing: Listing) => {
    try {
      await updateListing.mutateAsync({
        listingId: listing.id,
        listing: updatedListing,
      });
      toast.success('Listing updated successfully');
      navigate({ to: ROUTES.listing(listing.id) });
    } catch (error) {
      toast.error('Failed to update listing');
      console.error(error);
    }
  };

  const handleCancel = () => {
    navigate({ to: ROUTES.listing(listing.id) });
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-24 max-w-3xl">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate({ to: ROUTES.listing(listing.id) })}
        className="mb-4 -ml-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Listing
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Listing</CardTitle>
        </CardHeader>
        <CardContent>
          <EditListingForm listing={listing} onSubmit={handleSubmit} onCancel={handleCancel} />
        </CardContent>
      </Card>
    </div>
  );
}
