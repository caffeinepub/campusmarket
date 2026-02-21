import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, SlidersHorizontal } from 'lucide-react';
import type { SearchFilters } from '../searchFiltering';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SearchFiltersBarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

export function SearchFiltersBar({ filters, onFiltersChange }: SearchFiltersBarProps) {
  const hasActiveFilters = filters.category || filters.sort !== 'relevance';

  const handleClearFilters = () => {
    onFiltersChange({ sort: 'relevance' });
  };

  return (
    <div className="mb-6 flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filters:</span>
      </div>

      <Select
        value={filters.sort || 'relevance'}
        onValueChange={(value) => onFiltersChange({ ...filters, sort: value as any })}
      >
        <SelectTrigger className="w-[140px] rounded-xl border-border/50">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="relevance">Relevance</SelectItem>
          <SelectItem value="price-low">Price: Low to High</SelectItem>
          <SelectItem value="price-high">Price: High to Low</SelectItem>
          <SelectItem value="newest">Newest First</SelectItem>
        </SelectContent>
      </Select>

      {filters.category && (
        <Badge variant="secondary" className="rounded-lg px-3 py-1.5">
          {filters.category}
          <button
            onClick={() => onFiltersChange({ ...filters, category: undefined })}
            className="ml-2 hover:text-foreground"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearFilters}
          className="text-xs rounded-lg"
        >
          Clear all
        </Button>
      )}
    </div>
  );
}
