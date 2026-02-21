import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ProductCondition } from '../../../backend';

interface ConditionBadgeProps {
  condition: ProductCondition;
  showIndicator?: boolean;
  className?: string;
}

const conditionConfig = {
  [ProductCondition.likeNew]: {
    label: 'Like New',
    color: 'bg-condition-like-new text-white',
    wearLevel: 90,
  },
  [ProductCondition.good]: {
    label: 'Good',
    color: 'bg-condition-good text-white',
    wearLevel: 70,
  },
  [ProductCondition.fair]: {
    label: 'Fair',
    color: 'bg-condition-fair text-white',
    wearLevel: 50,
  },
  [ProductCondition.wellUsed]: {
    label: 'Well-Used',
    color: 'bg-condition-well-used text-white',
    wearLevel: 30,
  },
};

export function ConditionBadge({ condition, showIndicator = false, className }: ConditionBadgeProps) {
  const config = conditionConfig[condition];

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <Badge className={cn('rounded-full px-3 py-1 text-xs font-semibold border-0', config.color)}>
        {config.label}
      </Badge>
      {showIndicator && (
        <div className="flex items-center gap-1">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1.5 w-1.5 rounded-full',
                i < Math.floor(config.wearLevel / 25) ? config.color.split(' ')[0] : 'bg-muted'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
