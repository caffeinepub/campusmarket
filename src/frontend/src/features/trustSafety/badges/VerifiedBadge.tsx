import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle2 } from 'lucide-react';

interface VerifiedBadgeProps {
  verified: boolean;
  className?: string;
}

export function VerifiedBadge({ verified, className }: VerifiedBadgeProps) {
  if (!verified) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <CheckCircle2 className={`h-4 w-4 text-success inline-flex ${className || ''}`} />
        </TooltipTrigger>
        <TooltipContent>
          <p>Verified Student</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
