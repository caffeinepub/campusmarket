import type { SellWizardFormData } from '../sellWizard/sellWizardTypes';

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  field: keyof SellWizardFormData;
  value: string;
  icon: string;
}

export function generateTitleSuggestions(data: SellWizardFormData): Suggestion[] {
  const suggestions: Suggestion[] = [];

  if (data.title && data.category && data.condition) {
    const enhancedTitle = `${data.condition} ${data.category} - ${data.title}`;
    if (enhancedTitle !== data.title && enhancedTitle.length <= 100) {
      suggestions.push({
        id: 'title-enhance',
        title: 'Enhanced Title',
        description: 'Add condition and category for better visibility',
        field: 'title',
        value: enhancedTitle,
        icon: '✨',
      });
    }
  }

  return suggestions;
}

export function generateDescriptionSuggestions(data: SellWizardFormData): Suggestion[] {
  const suggestions: Suggestion[] = [];

  if (data.description.length < 50) {
    const template = `${data.description}\n\n📦 Condition: ${data.condition || 'Excellent'}\n💰 Price: Negotiable\n📍 Location: Campus\n✅ Ready for immediate pickup`;
    suggestions.push({
      id: 'desc-expand',
      title: 'Expand Description',
      description: 'Add structured details to attract buyers',
      field: 'description',
      value: template,
      icon: '📝',
    });
  }

  return suggestions;
}

export function generatePriceSuggestions(data: SellWizardFormData): Suggestion[] {
  const suggestions: Suggestion[] = [];

  if (data.price && data.condition) {
    const priceNum = parseFloat(data.price);
    if (!isNaN(priceNum) && priceNum > 0) {
      let suggestedPrice = priceNum;

      // Adjust based on condition
      if (data.condition === 'New') {
        suggestedPrice = Math.round(priceNum * 0.95);
      } else if (data.condition === 'Like New') {
        suggestedPrice = Math.round(priceNum * 0.85);
      } else if (data.condition === 'Good') {
        suggestedPrice = Math.round(priceNum * 0.7);
      } else if (data.condition === 'Fair') {
        suggestedPrice = Math.round(priceNum * 0.5);
      }

      if (suggestedPrice !== priceNum) {
        suggestions.push({
          id: 'price-adjust',
          title: 'Suggested Price',
          description: `Based on ${data.condition} condition`,
          field: 'price',
          value: suggestedPrice.toString(),
          icon: '💡',
        });
      }
    }
  }

  return suggestions;
}

export function generateAllSuggestions(data: SellWizardFormData): Suggestion[] {
  return [
    ...generateTitleSuggestions(data),
    ...generateDescriptionSuggestions(data),
    ...generatePriceSuggestions(data),
  ];
}
