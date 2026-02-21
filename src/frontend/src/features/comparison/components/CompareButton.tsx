import { Button } from '@/components/ui/button';
import { GitCompare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CompareButtonProps {
  count: number;
  onClick: () => void;
}

export function CompareButton({ count, onClick }: CompareButtonProps) {
  if (count < 2) return null;

  return (
    <div className="fixed bottom-20 right-4 z-40 md:bottom-6">
      <Button
        size="lg"
        onClick={onClick}
        className="rounded-full shadow-lg gap-2 pr-6"
      >
        <div className="relative">
          <GitCompare className="h-5 w-5" />
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {count}
          </Badge>
        </div>
        Compare
      </Button>
    </div>
  );
}
