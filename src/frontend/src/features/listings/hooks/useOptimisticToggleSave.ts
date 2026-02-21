import { useMemo } from 'react';
import { useSaveListing, useUnsaveListing, useGetSavedListings } from '../../../api/listings';
import { toast } from 'sonner';

export function useOptimisticToggleSave(listingId: string) {
  const { data: savedListings } = useGetSavedListings();
  const saveMutation = useSaveListing();
  const unsaveMutation = useUnsaveListing();

  const isSaved = useMemo(() => {
    return savedListings?.some((listing) => listing.id === listingId) ?? false;
  }, [savedListings, listingId]);

  const toggleSave = async () => {
    try {
      if (isSaved) {
        await unsaveMutation.mutateAsync(listingId);
        toast.success('Removed from saved');
      } else {
        await saveMutation.mutateAsync(listingId);
        toast.success('Saved successfully');
      }
    } catch (error) {
      toast.error(isSaved ? 'Failed to unsave listing' : 'Failed to save listing');
      console.error('Toggle save error:', error);
    }
  };

  return {
    isSaved,
    toggleSave,
    isLoading: saveMutation.isPending || unsaveMutation.isPending,
  };
}
