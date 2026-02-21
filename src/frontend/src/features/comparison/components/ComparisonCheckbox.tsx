import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface ComparisonCheckboxProps {
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function ComparisonCheckbox({ checked, disabled, onCheckedChange }: ComparisonCheckboxProps) {
  return (
    <div
      className={cn(
        'absolute top-2 left-2 z-10 rounded-md bg-background/95 backdrop-blur-md shadow-sm p-1.5',
        'motion-safe:transition-all',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <Checkbox
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        className="h-5 w-5"
      />
    </div>
  );
}
