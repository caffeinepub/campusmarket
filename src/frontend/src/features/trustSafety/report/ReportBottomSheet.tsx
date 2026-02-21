// Report bottom sheet UI
import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { REPORT_REASONS } from './reportReasons';
import { toast } from 'sonner';

interface ReportBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listingId: string;
}

export function ReportBottomSheet({ open, onOpenChange, listingId }: ReportBottomSheetProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason) {
      toast.error('Please select a reason');
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Wire to backend createReport when available
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Report submitted successfully');
      onOpenChange(false);
      setSelectedReason('');
    } catch (error) {
      toast.error('Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[80vh]">
        <SheetHeader>
          <SheetTitle>Report Listing</SheetTitle>
          <SheetDescription>
            Help us keep the marketplace safe by reporting issues
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
            {REPORT_REASONS.map(reason => (
              <div key={reason.id} className="flex items-center space-x-2">
                <RadioGroupItem value={reason.id} id={reason.id} />
                <Label htmlFor={reason.id} className="cursor-pointer">
                  {reason.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || !selectedReason} className="flex-1">
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
