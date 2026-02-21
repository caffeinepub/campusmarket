import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SellerRatingProps {
  rating: number;
  transactionCount: bigint;
  className?: string;
  showCount?: boolean;
}

export function SellerRating({ rating, transactionCount, className, showCount = true }: SellerRatingProps) {
  const count = Number(transactionCount);
  
  return (
    <div className={cn('flex items-center gap-1.5 text-sm', className)}>
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              'h-3.5 w-3.5',
              i < Math.floor(rating) ? 'fill-secondary text-secondary' : 'text-muted'
            )}
          />
        ))}
      </div>
      <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
      {showCount && count > 0 && (
        <span className="text-muted-foreground">({count} {count === 1 ? 'sale' : 'sales'})</span>
      )}
    </div>
  );
}
