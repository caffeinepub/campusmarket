import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Review } from '../../../backend';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const timeAgo = getTimeAgo(Number(review.created_at) / 1_000_000);

  return (
    <Card className="border-border/40">
      <CardContent className="p-4 space-y-3">
        {/* Reviewer Info & Rating */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="font-medium text-sm">
              {review.reviewer.toString().slice(0, 8)}...
            </p>
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'h-4 w-4',
                  i < Number(review.rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-muted-foreground'
                )}
              />
            ))}
          </div>
        </div>

        {/* Comment */}
        {review.comment && (
          <p className="text-sm leading-relaxed">{review.comment}</p>
        )}
      </CardContent>
    </Card>
  );
}

function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}
