import type { SellWizardFormData } from '../sellWizard/sellWizardTypes';
import { ProductCondition } from '../../../backend';

export function generateTitleSuggestion(data: SellWizardFormData): string {
  if (!data.title) return '';

  const title = data.title.trim();
  if (title.length < 5) return title;

  const words = title.split(' ');
  const capitalizedWords = words.map((word) => {
    if (word.length <= 2) return word.toLowerCase();
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  let enhanced = capitalizedWords.join(' ');

  if (data.condition === ProductCondition.likeNew && !enhanced.toLowerCase().includes('like new')) {
    enhanced = `${enhanced} - Like New`;
  }

  if (data.category && !enhanced.toLowerCase().includes(data.category.toLowerCase())) {
    enhanced = `${data.category}: ${enhanced}`;
  }

  return enhanced.slice(0, 100);
}

export function generateDescriptionSuggestion(data: SellWizardFormData): string {
  if (!data.description) return '';

  const desc = data.description.trim();
  if (desc.length < 20) return desc;

  let enhanced = desc;

  if (!enhanced.endsWith('.') && !enhanced.endsWith('!') && !enhanced.endsWith('?')) {
    enhanced += '.';
  }

  const conditionText = getConditionText(data.condition);
  if (conditionText && !enhanced.toLowerCase().includes('condition')) {
    enhanced += ` Item is in ${conditionText} condition.`;
  }

  if (data.category && !enhanced.toLowerCase().includes('perfect for')) {
    enhanced += ` Perfect for ${data.category.toLowerCase()} needs.`;
  }

  return enhanced.slice(0, 1000);
}

export function generatePriceSuggestion(data: SellWizardFormData): string {
  if (!data.price) return '';

  const price = Number(data.price);
  if (isNaN(price) || price <= 0) return data.price;

  let adjustedPrice = price;

  if (data.condition === ProductCondition.likeNew) {
    adjustedPrice = Math.round(price * 0.95);
  } else if (data.condition === ProductCondition.good) {
    adjustedPrice = Math.round(price * 0.9);
  } else if (data.condition === ProductCondition.fair) {
    adjustedPrice = Math.round(price * 0.85);
  } else if (data.condition === ProductCondition.wellUsed) {
    adjustedPrice = Math.round(price * 0.8);
  }

  const roundedPrice = Math.round(adjustedPrice / 10) * 10;

  return String(roundedPrice);
}

function getConditionText(condition: ProductCondition | ''): string {
  switch (condition) {
    case ProductCondition.likeNew:
      return 'like new';
    case ProductCondition.good:
      return 'good';
    case ProductCondition.fair:
      return 'fair';
    case ProductCondition.wellUsed:
      return 'well-used';
    default:
      return '';
  }
}
