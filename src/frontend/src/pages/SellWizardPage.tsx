import { useNavigate, useSearch } from '@tanstack/react-router';
import { toast } from 'sonner';
import { SellWizardForm } from '../features/listings/sellWizard/SellWizardForm';
import { useAddListing, useGetListing } from '../api/listings';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../api/profile';
import { ROUTES } from '../app/routes';
import { duplicateListingToFormData } from '../features/listings/sellWizard/duplicate/duplicateListing';
import type { SellWizardFormData } from '../features/listings/sellWizard/sellWizardTypes';
import type { Listing, ListingStatus } from '../backend';
import { AppShell } from '../app/layout/AppShell';
import { useEffect, useState } from 'react';

export default function SellWizardPage() {
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as { duplicate?: string };
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const addListingMutation = useAddListing();
  const { data: duplicateSource } = useGetListing(searchParams.duplicate || '');
  const [initialData, setInitialData] = useState<Partial<SellWizardFormData> | undefined>();

  useEffect(() => {
    if (searchParams.duplicate && duplicateSource) {
      setInitialData(duplicateListingToFormData(duplicateSource));
    }
  }, [searchParams.duplicate, duplicateSource]);

  const handleSubmit = async (formData: SellWizardFormData) => {
    if (!identity || !userProfile) {
      toast.error('Please complete your profile first');
      return;
    }

    const listing: Listing = {
      id: `listing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: formData.title,
      description: formData.description,
      price: Math.round(parseFloat(formData.price)),
      condition: formData.condition,
      category: formData.category,
      status: 'active' as ListingStatus,
      seller: identity.getPrincipal(),
      department: userProfile.department,
      hostel: userProfile.hostel,
      campus: userProfile.campus,
      images: formData.images,
      created_at: BigInt(Date.now() * 1_000_000),
      updated_at: BigInt(Date.now() * 1_000_000),
    };

    try {
      await addListingMutation.mutateAsync(listing);
      toast.success('Listing posted successfully!');
      navigate({ to: ROUTES.myListings });
    } catch (error) {
      console.error('Failed to create listing:', error);
      toast.error('Failed to post listing. Please try again.');
      throw error;
    }
  };

  const handleCancel = () => {
    navigate({ to: ROUTES.home });
  };

  return (
    <AppShell>
      <div className="container mx-auto max-w-3xl p-4 pb-24">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            {searchParams.duplicate ? 'Duplicate Listing' : 'Create Listing'}
          </h1>
          <p className="text-muted-foreground">List your item for sale on campus</p>
        </div>
        <SellWizardForm initialData={initialData} onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </AppShell>
  );
}
