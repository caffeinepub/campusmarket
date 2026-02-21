// Recent searches panel with per-item delete and clear-all
import { getRecentSearches, deleteRecentSearch, clearRecentSearches } from '../../../store/persistence/recentSearches';
import { Button } from '@/components/ui/button';
import { Clock, X } from 'lucide-react';
import { useState } from 'react';

interface RecentSearchesPanelProps {
  onSelectSearch: (term: string) => void;
}

export function RecentSearchesPanel({ onSelectSearch }: RecentSearchesPanelProps) {
  const [searches, setSearches] = useState(getRecentSearches());

  const handleDelete = (term: string) => {
    deleteRecentSearch(term);
    setSearches(getRecentSearches());
  };

  const handleClearAll = () => {
    clearRecentSearches();
    setSearches([]);
  };

  if (searches.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-muted-foreground">Recent Searches</h4>
        <Button variant="ghost" size="sm" onClick={handleClearAll} className="h-auto p-1 text-xs">
          Clear all
        </Button>
      </div>
      <div className="space-y-1">
        {searches.map(term => (
          <div
            key={term}
            className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-accent transition-colors group"
          >
            <button
              onClick={() => onSelectSearch(term)}
              className="flex flex-1 items-center gap-2 text-left text-sm"
            >
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{term}</span>
            </button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleDelete(term)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
