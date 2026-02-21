import type { ListingImage } from '../../../backend';

export interface SellWizardFormData {
  title: string;
  description: string;
  price: string;
  condition: string;
  category: string;
  images: ListingImage[];
}

export const WIZARD_STEPS = {
  BASIC_INFO: 0,
  PRICING_DETAILS: 1,
  IMAGES: 2,
  REVIEW: 3,
} as const;

export type WizardStep = typeof WIZARD_STEPS[keyof typeof WIZARD_STEPS];

export const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor'] as const;
export const CATEGORIES = [
  'Electronics',
  'Books',
  'Furniture',
  'Clothing',
  'Sports',
  'Other',
] as const;
