import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { SellWizardFormData } from '../sellWizardTypes';
import { CATEGORIES } from '../sellWizardTypes';
import { ProductCondition } from '../../../../backend';
import type { ValidationErrors } from '../sellWizardValidation';

interface BasicInfoStepProps {
  data: SellWizardFormData;
  errors: ValidationErrors;
  onChange: (field: keyof SellWizardFormData, value: any) => void;
}

const CONDITIONS = [
  { value: ProductCondition.likeNew, label: 'Like New' },
  { value: ProductCondition.good, label: 'Good' },
  { value: ProductCondition.fair, label: 'Fair' },
  { value: ProductCondition.wellUsed, label: 'Well-Used' },
];

export function BasicInfoStep({ data, errors, onChange }: BasicInfoStepProps) {
  return (
    <Card className="interactive-glow">
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>Tell us about your item</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            placeholder="e.g., iPhone 13 Pro Max 256GB"
            value={data.title}
            onChange={(e) => onChange('title', e.target.value)}
            className={errors.title ? 'border-destructive' : ''}
          />
          {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select value={data.category} onValueChange={(value) => onChange('category', value)}>
            <SelectTrigger id="category" className={errors.category ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="condition">Condition *</Label>
          <Select value={data.condition as string} onValueChange={(value) => onChange('condition', value as ProductCondition)}>
            <SelectTrigger id="condition" className={errors.condition ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              {CONDITIONS.map((condition) => (
                <SelectItem key={condition.value} value={condition.value}>
                  {condition.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.condition && <p className="text-sm text-destructive">{errors.condition}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="defect_description">Item Wear & Defects (Optional)</Label>
          <Textarea
            id="defect_description"
            placeholder="Describe any issues, scratches, or wear..."
            value={data.defect_description || ''}
            onChange={(e) => onChange('defect_description', e.target.value)}
            rows={3}
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground">
            {(data.defect_description || '').length} / 500 characters
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
