// Pull-to-refresh container component
import { ReactNode } from 'react';
import { usePullToRefresh } from './usePullToRefresh';
import { Loader2 } from 'lucide-react';

interface PullToRefreshContainerProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
}

export function PullToRefreshContainer({ onRefresh, children }: PullToRefreshContainerProps) {
  const { isPulling, pullDistance } = usePullToRefresh(onRefresh);

  return (
    <div className="relative">
      {isPulling && (
        <div
          className="absolute top-0 left-0 right-0 flex justify-center transition-transform"
          style={{ transform: `translateY(${Math.min(pullDistance - 40, 40)}px)` }}
        >
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
      {children}
    </div>
  );
}
