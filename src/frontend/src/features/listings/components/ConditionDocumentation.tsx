import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { ConditionBadge } from './ConditionBadge';
import type { ProductCondition } from '../../../backend';

interface ConditionDocumentationProps {
  condition: ProductCondition;
  defectDescription?: string;
  className?: string;
}

export function ConditionDocumentation({ condition, defectDescription, className }: ConditionDocumentationProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Item Condition</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <ConditionBadge condition={condition} showIndicator />
        </div>
        
        {defectDescription && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-warning" />
              Wear & Defects
            </h4>
            <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
              {defectDescription}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
