import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import type { SellWizardFormData, WizardStep } from '../sellWizardTypes';
import { ConditionBadge } from '../../components/ConditionBadge';
import { ProductCondition } from '../../../../backend';

interface ReviewSubmitStepProps {
  data: SellWizardFormData;
  onEditStep?: (step: WizardStep) => void;
}

export function ReviewSubmitStep({ data, onEditStep }: ReviewSubmitStepProps) {
  const hasOriginalPrice = data.original_price && Number(data.original_price) > Number(data.price);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Basic Information</CardTitle>
          {onEditStep && (
            <Button variant="ghost" size="sm" onClick={() => onEditStep(0)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Title</p>
            <p className="font-medium">{data.title}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Category</p>
            <Badge variant="secondary">{data.category}</Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Condition</p>
            <ConditionBadge condition={data.condition as ProductCondition} showIndicator />
          </div>
          {data.defect_description && (
            <div>
              <p className="text-sm text-muted-foreground">Wear & Defects</p>
              <p className="text-sm">{data.defect_description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pricing & Details</CardTitle>
          {onEditStep && (
            <Button variant="ghost" size="sm" onClick={() => onEditStep(1)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Price</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold">₹{data.price}</p>
              {hasOriginalPrice && (
                <p className="text-lg text-muted-foreground line-through">₹{data.original_price}</p>
              )}
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Description</p>
            <p className="text-sm">{data.description}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Meetup Locations</CardTitle>
          {onEditStep && (
            <Button variant="ghost" size="sm" onClick={() => onEditStep(2)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {data.meetup_locations.map((location, index) => (
              <Badge key={index} variant="outline">
                {location.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Photos</CardTitle>
          {onEditStep && (
            <Button variant="ghost" size="sm" onClick={() => onEditStep(3)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {data.images.map((image, index) => (
              <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted">
                <img
                  src={image.url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
