import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { generateAllSuggestions } from './aiSuggestions';
import type { SellWizardFormData } from '../sellWizard/sellWizardTypes';

interface AIAssistCardsProps {
  formData: SellWizardFormData;
  currentStep: number;
  onApplySuggestion: (field: keyof SellWizardFormData, value: string) => void;
}

export function AIAssistCards({ formData, currentStep, onApplySuggestion }: AIAssistCardsProps) {
  const suggestions = generateAllSuggestions(formData);

  if (suggestions.length === 0) return null;

  return (
    <Card className="border-primary/20 bg-primary/5 interactive-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Suggestions
        </CardTitle>
        <CardDescription>Quick improvements to make your listing stand out</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="flex items-start justify-between gap-3 rounded-lg border bg-background p-3 transition-all hover:border-primary/30"
          >
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">{suggestion.icon}</span>
                <h4 className="font-semibold text-sm">{suggestion.title}</h4>
              </div>
              <p className="text-xs text-muted-foreground">{suggestion.description}</p>
              <p className="text-sm text-foreground/80 line-clamp-2 mt-1">{suggestion.value}</p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onApplySuggestion(suggestion.field, suggestion.value)}
              className="shrink-0"
            >
              Apply
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
