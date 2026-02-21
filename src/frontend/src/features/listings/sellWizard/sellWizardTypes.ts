import type { ListingImage, LocationDetail, ProductCondition } from '../../../backend';

export interface SellWizardFormData {
  title: string;
  description: string;
  price: string;
  original_price?: string;
  condition: ProductCondition | '';
  category: string;
  images: ListingImage[];
  meetup_locations: LocationDetail[];
  defect_description?: string;
}

export const WIZARD_STEPS = {
  BASIC_INFO: 0,
  PRICING_DETAILS: 1,
  LOCATION: 2,
  IMAGES: 3,
  REVIEW: 4,
} as const;

export type WizardStep = 0 | 1 | 2 | 3 | 4;

export const CATEGORIES = [
  'Textbooks',
  'Electronics',
  'Dorm Furniture',
  'Clothes',
  'Kitchen Items',
  'Decor',
  'Other',
] as const;

export const MIN_IMAGES = 1;
export const MAX_IMAGES = 5;
