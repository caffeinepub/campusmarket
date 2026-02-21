import type { SellWizardFormData } from './sellWizardTypes';

export interface ValidationErrors {
  title?: string;
  description?: string;
  price?: string;
  condition?: string;
  category?: string;
}

export function validateBasicInfo(data: SellWizardFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.title.trim()) {
    errors.title = 'Title is required';
  } else if (data.title.length < 3) {
    errors.title = 'Title must be at least 3 characters';
  } else if (data.title.length > 100) {
    errors.title = 'Title must be less than 100 characters';
  }

  if (!data.category) {
    errors.category = 'Category is required';
  }

  if (!data.condition) {
    errors.condition = 'Condition is required';
  }

  return errors;
}

export function validatePricingDetails(data: SellWizardFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.price.trim()) {
    errors.price = 'Price is required';
  } else {
    const priceNum = parseFloat(data.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      errors.price = 'Price must be a positive number';
    } else if (priceNum > 1000000) {
      errors.price = 'Price must be less than ₹10,00,000';
    }
  }

  if (!data.description.trim()) {
    errors.description = 'Description is required';
  } else if (data.description.length < 10) {
    errors.description = 'Description must be at least 10 characters';
  } else if (data.description.length > 1000) {
    errors.description = 'Description must be less than 1000 characters';
  }

  return errors;
}

export function validateAllSteps(data: SellWizardFormData): ValidationErrors {
  return {
    ...validateBasicInfo(data),
    ...validatePricingDetails(data),
  };
}
