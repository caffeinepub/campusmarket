import { useNavigate, useSearch } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SellWizardForm } from '../features/listings/sellWizard/SellWizardForm';
import { useAddListing, useGetListing } from '../api/listings';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import { ROUTES } from '../app/routes';
import { ListingStatus, ProductCondition } from '../backend';
import type { SellWizardFormData } from '../features/listings/sellWizard/sellWizardTypes';
import { duplicateListing } from '../features/listings/sellWizard/duplicate/duplicateListing';
import { clearAutosuggestCache } from '../features/search/autosuggest/autosuggestCache';
import { AppShell } from '../app/layout/AppShell';
import { useState } from 'react';
import { ConfirmDiscardModal } from '../app/modals/ConfirmDiscardModal';
import { useSellDraftAutosave } from '../features/listings/sellWizard/useSellDraftAutosave';

export default function SellWizardPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/protected/sell' }) as { duplicate?: string };
  const duplicateId = search?.duplicate;
  const { data: duplicateSource } = useGetListing(duplicateId || '');
  const addListing = useAddListing();
  const { identity } = useInternetIdentity();
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [formData, setFormData] = useState<SellWizardFormData | null>(null);

  const initialData = duplicateSource ? duplicateListing(duplicateSource) : undefined;

  const handleSubmit = async (formData: SellWizardFormData) => {
    if (!identity) {
      toast.error('You must be logged in to create a listing');
      return;
    }

    if (!formData.condition || formData.condition === ('' as any)) {
      toast.error('Please select a condition');
      return;
    }

    try {
      await addListing.mutateAsync({
        id: `listing-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        original_price: formData.original_price ? Number(formData.original_price) : undefined,
        condition: formData.condition as ProductCondition,
        category: formData.category,
        status: ListingStatus.active,
        seller: identity.getPrincipal(),
        department: 'General',
        hostel: 'Default',
        campus: 'Main Campus',
        meetup_locations: formData.meetup_locations,
        images: formData.images,
        created_at: BigInt(Date.now() * 1_000_000),
        updated_at: BigInt(Date.now() * 1_000_000),
        defect_description: formData.defect_description,
        trust_indicators: {
          verified_student: false,
          star_rating: 0,
          transaction_count: BigInt(0),
          reliability_score: 0,
        },
      });

      clearAutosuggestCache();
      toast.success('Listing created successfully!');
      navigate({ to: ROUTES.myListings });
    } catch (error) {
      toast.error('Failed to create listing');
      console.error(error);
    }
  };

  const handleCancel = () => {
    navigate({ to: ROUTES.home });
  };

  const handleBackClick = () => {
    // Check if there's unsaved data
    const hasUnsavedChanges = formData && (
      formData.title || 
      formData.description || 
      formData.price || 
      formData.images.length > 0
    );

    if (hasUnsavedChanges) {
      setShowDiscardModal(true);
    } else {
      navigate({ to: ROUTES.home });
    }
  };

  const handleDiscardConfirm = () => {
    setShowDiscardModal(false);
    navigate({ to: ROUTES.home });
  };

  return (
    <AppShell showBack onBackClick={handleBackClick}>
      <div className="container mx-auto px-4 py-6 pb-24 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {duplicateId ? 'Duplicate Listing' : 'Create New Listing'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SellWizardForm
              initialData={initialData}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              onFormChange={setFormData}
            />
          </CardContent>
        </Card>
      </div>

      <ConfirmDiscardModal
        open={showDiscardModal}
        onOpenChange={setShowDiscardModal}
        onConfirm={handleDiscardConfirm}
      />
    </AppShell>
  );
}
