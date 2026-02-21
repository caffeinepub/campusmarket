// Enhance with AI panel with diff preview
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, RefreshCw } from 'lucide-react';
import { useAIProvider } from '../../ai/provider/aiProvider';
import type { SellWizardFormData } from '../sellWizard/sellWizardTypes';

interface EnhanceWithAIPanelProps {
  formData: SellWizardFormData;
  onApply: (field: keyof SellWizardFormData, value: string) => void;
}

export function EnhanceWithAIPanel({ formData, onApply }: EnhanceWithAIPanelProps) {
  const { aiEnabled, enhanceListing } = useAIProvider();
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<{ title?: string; description?: string } | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await enhanceListing(formData.title, formData.description, formData.category);
      setSuggestions({
        title: result.title,
        description: result.description,
      });
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!aiEnabled) {
    return (
      <Card className="border-muted">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            AI assistance is currently unavailable
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-5 w-5 text-primary" />
          Enhance with AI
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!suggestions ? (
          <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Suggestions
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-3">
            {suggestions.title && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Suggested Title:</div>
                <div className="rounded-md bg-muted p-3 text-sm">{suggestions.title}</div>
                <Button size="sm" variant="outline" onClick={() => onApply('title', suggestions.title!)}>
                  Apply Title
                </Button>
              </div>
            )}
            {suggestions.description && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Suggested Description:</div>
                <div className="rounded-md bg-muted p-3 text-sm whitespace-pre-wrap">{suggestions.description}</div>
                <Button size="sm" variant="outline" onClick={() => onApply('description', suggestions.description!)}>
                  Apply Description
                </Button>
              </div>
            )}
            <Button size="sm" variant="ghost" onClick={handleGenerate} disabled={isGenerating}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
