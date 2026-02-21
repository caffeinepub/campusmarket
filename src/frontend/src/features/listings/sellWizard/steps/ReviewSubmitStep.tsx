import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { SellWizardFormData } from '../sellWizardTypes';

interface ReviewSubmitStepProps {
  data: SellWizardFormData;
}

export function ReviewSubmitStep({ data }: ReviewSubmitStepProps) {
  return (
    <Card className="interactive-glow">
      <CardHeader>
        <CardTitle>Review Your Listing</CardTitle>
        <CardDescription>Make sure everything looks good before posting</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.images.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm font-semibold">Photos ({data.images.length})</h4>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {data.images.map((image, index) => (
                <div key={image.id.toString()} className="relative aspect-square overflow-hidden rounded-md border">
                  <img src={image.url} alt={`Preview ${index + 1}`} className="h-full w-full object-cover" />
                  {index === 0 && (
                    <Badge className="absolute left-1 top-1 text-xs">Cover</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        <div>
          <h4 className="mb-2 text-sm font-semibold">Title</h4>
          <p className="text-foreground">{data.title}</p>
        </div>

        <div className="flex gap-4">
          <div>
            <h4 className="mb-2 text-sm font-semibold">Price</h4>
            <p className="text-lg font-bold text-primary">₹{data.price}</p>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-semibold">Category</h4>
            <Badge variant="secondary">{data.category}</Badge>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-semibold">Condition</h4>
            <Badge variant="outline">{data.condition}</Badge>
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold">Description</h4>
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">{data.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
