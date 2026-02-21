// Quick offer template button
import { Button } from '@/components/ui/button';
import { DollarSign } from 'lucide-react';

interface QuickOfferButtonProps {
  onInsertOffer: () => void;
  disabled?: boolean;
}

export function QuickOfferButton({ onInsertOffer, disabled }: QuickOfferButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onInsertOffer}
      disabled={disabled}
      title="Quick offer"
    >
      <DollarSign className="h-5 w-5" />
    </Button>
  );
}
