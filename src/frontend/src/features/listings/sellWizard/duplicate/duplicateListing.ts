import type { Listing } from '../../../../backend';
import type { SellWizardFormData } from '../sellWizardTypes';

export function duplicateListing(listing: Listing): Partial<SellWizardFormData> {
  return {
    title: `${listing.title} (Copy)`,
    description: listing.description,
    price: String(listing.price),
    original_price: listing.original_price ? String(listing.original_price) : undefined,
    condition: listing.condition,
    category: listing.category,
    images: listing.images,
    meetup_locations: listing.meetup_locations,
    defect_description: listing.defect_description,
  };
}
