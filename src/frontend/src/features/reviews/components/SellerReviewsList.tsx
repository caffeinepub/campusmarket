import { ReviewCard } from './ReviewCard';
import type { Review } from '../../../backend';

interface SellerReviewsListProps {
  reviews: Review[];
}

export function SellerReviewsList({ reviews }: SellerReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">No reviews yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((review, idx) => (
        <ReviewCard key={idx} review={review} />
      ))}
    </div>
  );
}
