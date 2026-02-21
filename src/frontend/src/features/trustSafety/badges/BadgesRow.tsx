// UI-only placeholder badges
import { Badge } from '@/components/ui/badge';
import { Award, Zap, Shield } from 'lucide-react';
import { ReactNode } from 'react';

interface BadgesRowProps {
  isNewSeller?: boolean;
  isTrusted?: boolean;
  isFastResponder?: boolean;
}

export function BadgesRow({ isNewSeller, isTrusted, isFastResponder }: BadgesRowProps) {
  const badges: ReactNode[] = [];

  if (isNewSeller) {
    badges.push(
      <Badge key="new" variant="secondary" className="gap-1">
        <Award className="h-3 w-3" />
        New Seller
      </Badge>
    );
  }

  if (isTrusted) {
    badges.push(
      <Badge key="trusted" variant="default" className="gap-1">
        <Shield className="h-3 w-3" />
        Trusted
      </Badge>
    );
  }

  if (isFastResponder) {
    badges.push(
      <Badge key="fast" variant="outline" className="gap-1">
        <Zap className="h-3 w-3" />
        Fast Responder
      </Badge>
    );
  }

  if (badges.length === 0) return null;

  return <div className="flex flex-wrap gap-2">{badges}</div>;
}
