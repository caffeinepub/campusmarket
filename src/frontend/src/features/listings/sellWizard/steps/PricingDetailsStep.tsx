import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { SellWizardFormData } from '../sellWizardTypes';
import type { ValidationErrors } from '../sellWizardValidation';

interface PricingDetailsStepProps {
  data: SellWizardFormData;
  errors: ValidationErrors;
  onChange: (field: keyof SellWizardFormData, value: string) => void;
}

export function PricingDetailsStep({ data, errors, onChange }: PricingDetailsStepProps) {
  return (
    <Card className="interactive-glow">
      <CardHeader>
        <CardTitle>Pricing & Details</CardTitle>
        <CardDescription>Set your price and describe your item</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price (₹) *</Label>
            <Input
              id="price"
              type="number"
              placeholder="e.g., 45000"
              value={data.price}
              onChange={(e) => onChange('price', e.target.value)}
              className={errors.price ? 'border-destructive' : ''}
            />
            {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="original_price">Original Price (₹)</Label>
            <Input
              id="original_price"
              type="number"
              placeholder="Optional"
              value={data.original_price || ''}
              onChange={(e) => onChange('original_price', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Show discount if applicable</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            placeholder="Describe your item in detail. Include any accessories or special features..."
            value={data.description}
            onChange={(e) => onChange('description', e.target.value)}
            className={errors.description ? 'border-destructive' : ''}
            rows={6}
          />
          {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
          <p className="text-xs text-muted-foreground">{data.description.length} / 1000 characters</p>
        </div>
      </CardContent>
    </Card>
  );
}
