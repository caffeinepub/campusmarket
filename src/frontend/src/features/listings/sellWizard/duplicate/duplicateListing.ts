// Helper to map existing Listing into SellWizardForm initialData
import type { Listing } from '../../../../backend';
import type { SellWizardFormData } from '../sellWizardTypes';

export function duplicateListingToFormData(listing: Listing): SellWizardFormData {
  return {
    title: listing.title,
    description: listing.description,
    price: String(listing.price),
    condition: listing.condition,
    category: listing.category,
    images: listing.images,
  };
}
