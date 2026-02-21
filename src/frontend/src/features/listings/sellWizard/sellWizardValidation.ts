import type { SellWizardFormData } from './sellWizardTypes';
import { MIN_IMAGES } from './sellWizardTypes';

export interface ValidationErrors {
  [key: string]: string;
}

export function validateBasicInfo(data: SellWizardFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.title || data.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }

  if (!data.category) {
    errors.category = 'Please select a category';
  }

  if (!data.condition) {
    errors.condition = 'Please select a condition';
  }

  return errors;
}

export function validatePricing(data: SellWizardFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  const price = Number(data.price);
  if (!data.price || isNaN(price) || price <= 0) {
    errors.price = 'Please enter a valid price';
  }

  if (data.original_price) {
    const originalPrice = Number(data.original_price);
    if (isNaN(originalPrice) || originalPrice < price) {
      errors.original_price = 'Original price must be greater than or equal to current price';
    }
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }

  if (data.description.length > 1000) {
    errors.description = 'Description must be less than 1000 characters';
  }

  return errors;
}

export function validateLocation(data: SellWizardFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (data.meetup_locations.length === 0) {
    errors.meetup_locations = 'Please select at least one meetup location';
  }

  return errors;
}

export function validateImages(data: SellWizardFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (data.images.length < MIN_IMAGES) {
    errors.images = `Please add at least ${MIN_IMAGES} photo`;
  }

  return errors;
}

export function validateAllSteps(data: SellWizardFormData): ValidationErrors {
  const errors: ValidationErrors = {
    ...validateBasicInfo(data),
    ...validatePricing(data),
    ...validateLocation(data),
    ...validateImages(data),
  };

  return errors;
}
