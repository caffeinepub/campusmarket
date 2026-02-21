import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ImagePicker } from '../sellWizard/ImagePicker';
import { CATEGORIES } from '../sellWizard/sellWizardTypes';
import { ProductCondition, type Listing, type ListingImage, type LocationDetail } from '../../../backend';
import { validateAllSteps } from '../sellWizard/sellWizardValidation';
import type { ValidationErrors } from '../sellWizard/sellWizardValidation';
import type { SellWizardFormData } from '../sellWizard/sellWizardTypes';

interface EditListingFormProps {
  listing: Listing;
  onSubmit: (data: Listing) => Promise<void>;
  onCancel: () => void;
}

const CONDITIONS = [
  { value: ProductCondition.likeNew, label: 'Like New' },
  { value: ProductCondition.good, label: 'Good' },
  { value: ProductCondition.fair, label: 'Fair' },
  { value: ProductCondition.wellUsed, label: 'Well-Used' },
];

export function EditListingForm({ listing, onSubmit, onCancel }: EditListingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const [formData, setFormData] = useState({
    title: listing.title,
    description: listing.description,
    price: String(listing.price),
    original_price: listing.original_price ? String(listing.original_price) : '',
    condition: listing.condition,
    category: listing.category,
    images: listing.images,
    meetup_locations: listing.meetup_locations,
    defect_description: listing.defect_description,
  });

  const handleFieldChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const handleSubmit = async () => {
    const wizardData: SellWizardFormData = {
      title: formData.title,
      description: formData.description,
      price: formData.price,
      original_price: formData.original_price,
      condition: formData.condition,
      category: formData.category,
      images: formData.images,
      meetup_locations: formData.meetup_locations,
      defect_description: formData.defect_description,
    };

    const validationErrors = validateAllSteps(wizardData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...listing,
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        original_price: formData.original_price ? Number(formData.original_price) : undefined,
        condition: formData.condition,
        category: formData.category,
        images: formData.images,
        meetup_locations: formData.meetup_locations,
        defect_description: formData.defect_description,
        updated_at: BigInt(Date.now() * 1_000_000),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
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
            <Select
              value={formData.condition}
              onValueChange={(value) => handleFieldChange('condition', value as ProductCondition)}
            >
              <SelectTrigger id="condition" className={errors.condition ? 'border-destructive' : ''}>
                <SelectValue />
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
              value={formData.defect_description || ''}
              onChange={(e) => handleFieldChange('defect_description', e.target.value)}
              rows={3}
              maxLength={500}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing & Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="original_price">Original Price (₹)</Label>
              <Input
                id="original_price"
                type="number"
                value={formData.original_price}
                onChange={(e) => handleFieldChange('original_price', e.target.value)}
              />
            </div>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Photos</CardTitle>
        </CardHeader>
        <CardContent>
          <ImagePicker
            images={formData.images}
            onChange={(images) => handleFieldChange('images', images)}
            maxImages={5}
          />
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
