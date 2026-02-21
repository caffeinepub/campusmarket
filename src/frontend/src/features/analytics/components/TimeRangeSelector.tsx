import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type TimeRange = '7' | '30' | '90';

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
}

export function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  const options: { value: TimeRange; label: string }[] = [
    { value: '7', label: '7 days' },
    { value: '30', label: '30 days' },
    { value: '90', label: '90 days' },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Time Range:</span>
      <div className="inline-flex rounded-lg border border-border/50 bg-muted/30 p-1">
        {options.map((option) => (
          <Button
            key={option.value}
            variant="ghost"
            size="sm"
            onClick={() => onChange(option.value)}
            className={cn(
              'rounded-md px-4 py-1.5 text-sm font-medium transition-all',
              value === option.value
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
