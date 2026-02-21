import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import type { SellWizardFormData } from '../sellWizard/sellWizardTypes';
import { generateTitleSuggestion, generateDescriptionSuggestion, generatePriceSuggestion } from './aiSuggestions';

interface AIAssistCardsProps {
  formData: SellWizardFormData;
  currentStep: number;
  onApplySuggestion: (field: keyof SellWizardFormData, value: string) => void;
}

interface Suggestion {
  field: keyof SellWizardFormData;
  label: string;
  value: string;
}

export function AIAssistCards({ formData, currentStep, onApplySuggestion }: AIAssistCardsProps) {
  const titleSuggestion = generateTitleSuggestion(formData);
  const descriptionSuggestion = generateDescriptionSuggestion(formData);
  const priceSuggestion = generatePriceSuggestion(formData);

  const suggestions: Suggestion[] = [];

  if (currentStep === 0 && titleSuggestion && titleSuggestion !== formData.title) {
    suggestions.push({
      field: 'title',
      label: 'Enhanced Title',
      value: titleSuggestion,
    });
  }

  if (currentStep === 1) {
    if (descriptionSuggestion && descriptionSuggestion !== formData.description) {
      suggestions.push({
        field: 'description',
        label: 'Enhanced Description',
        value: descriptionSuggestion,
      });
    }
    if (priceSuggestion && priceSuggestion !== formData.price) {
      suggestions.push({
        field: 'price',
        label: 'Suggested Price',
        value: priceSuggestion,
      });
    }
  }

  if (suggestions.length === 0) return null;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          AI Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((suggestion) => (
          <div key={suggestion.field} className="flex items-start justify-between gap-3 p-3 bg-background rounded-lg">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium mb-1">{suggestion.label}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{suggestion.value}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onApplySuggestion(suggestion.field, suggestion.value)}
            >
              Apply
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
