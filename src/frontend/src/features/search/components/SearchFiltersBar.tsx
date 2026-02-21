import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SORT_OPTIONS } from '../../listings/filters/sortOptions';

interface SearchFiltersBarProps {
  sort: string;
  onSortChange: (sort: string) => void;
  activeFilters?: string[];
  onClearFilters?: () => void;
  onOpenFilters?: () => void;
}

export function SearchFiltersBar({
  sort,
  onSortChange,
  activeFilters = [],
  onClearFilters,
  onOpenFilters,
}: SearchFiltersBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-border/50 bg-card/50 shadow-xs">
      {/* Filter Button (Mobile) */}
      {onOpenFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenFilters}
          className="md:hidden rounded-xl"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
          {activeFilters.length > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
              {activeFilters.length}
            </Badge>
          )}
        </Button>
      )}

      {/* Sort Dropdown */}
      <Select value={sort} onValueChange={onSortChange}>
        <SelectTrigger className="w-[180px] rounded-xl border-border/50">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.map((filter, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="rounded-full px-3 py-1 text-xs font-medium"
            >
              {filter}
            </Badge>
          ))}
          {onClearFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-7 px-2 text-xs rounded-full hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-3 w-3 mr-1" />
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
