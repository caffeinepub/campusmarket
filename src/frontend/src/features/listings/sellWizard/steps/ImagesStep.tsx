import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImagePicker } from '../ImagePicker';
import type { SellWizardFormData } from '../sellWizardTypes';
import type { ListingImage } from '../../../../backend';

interface ImagesStepProps {
  data: SellWizardFormData;
  onChange: (field: keyof SellWizardFormData, value: ListingImage[]) => void;
}

export function ImagesStep({ data, onChange }: ImagesStepProps) {
  return (
    <Card className="interactive-glow">
      <CardHeader>
        <CardTitle>Add Photos</CardTitle>
        <CardDescription>Add up to 5 photos. The first photo will be the cover image.</CardDescription>
      </CardHeader>
      <CardContent>
        <ImagePicker
          images={data.images}
          onChange={(images) => onChange('images', images)}
          maxImages={5}
        />
      </CardContent>
    </Card>
  );
}
