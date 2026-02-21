import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ImagePicker } from '../sellWizard/ImagePicker';
import { AIAssistCards } from '../aiAssist/AIAssistCards';
import { useIsAIAssistEnabled } from '../../../api/aiAssist';
import { CATEGORIES, CONDITIONS } from '../sellWizard/sellWizardTypes';
import { validateAllSteps } from '../sellWizard/sellWizardValidation';
import type { Listing, ListingImage } from '../../../backend';
import type { ValidationErrors } from '../sellWizard/sellWizardValidation';

interface EditListingFormProps {
  listing: Listing;
  onSubmit: (listing: Listing) => Promise<void>;
  onCancel: () => void;
}

export function EditListingForm({ listing, onSubmit, onCancel }: EditListingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const { data: aiEnabled } = useIsAIAssistEnabled();

  const [formData, setFormData] = useState({
    title: listing.title,
    description: listing.description,
    price: listing.price.toString(),
    condition: listing.condition,
    category: listing.category,
    images: listing.images,
  });

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async () => {
    const validationErrors = validateAllSteps(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const updatedListing: Listing = {
      ...listing,
      title: formData.title,
      description: formData.description,
      price: Math.round(parseFloat(formData.price)),
      condition: formData.condition,
      category: formData.category,
      images: formData.images,
      updated_at: BigInt(Date.now() * 1_000_000),
    };

    setIsSubmitting(true);
    try {
      await onSubmit(updatedListing);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {aiEnabled && (
        <AIAssistCards
          formData={formData}
          currentStep={0}
          onApplySuggestion={handleFieldChange}
        />
      )}

      <Card className="interactive-glow">
        <CardHeader>
          <CardTitle>Listing Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleFieldChange('category', value)}>
                <SelectTrigger id="category" className={errors.category ? 'border-destructive' : ''}>
                  <SelectValue />
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
              <Select value={formData.condition} onValueChange={(value) => handleFieldChange('condition', value)}>
                <SelectTrigger id="condition" className={errors.condition ? 'border-destructive' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONDITIONS.map((condition) => (
                    <SelectItem key={condition} value={condition}>
                      {condition}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.condition && <p className="text-sm text-destructive">{errors.condition}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (₹) *</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => handleFieldChange('price', e.target.value)}
              className={errors.price ? 'border-destructive' : ''}
            />
            {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              className={errors.description ? 'border-destructive' : ''}
              rows={6}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
          </div>

          <div className="space-y-2">
            <Label>Photos</Label>
            <ImagePicker
              images={formData.images}
              onChange={(images) => handleFieldChange('images', images)}
              maxImages={5}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="button" onClick={handleSubmit} disabled={isSubmitting} className="min-w-32">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </div>
  );
}
