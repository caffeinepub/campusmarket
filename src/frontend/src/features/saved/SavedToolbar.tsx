import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import type { SavedFilters } from './savedSortingFiltering';
import { SORT_OPTIONS } from '../listings/filters/sortOptions';

interface SavedToolbarProps {
  filters: SavedFilters;
  onFiltersChange: (filters: SavedFilters) => void;
}

export function SavedToolbar({ filters, onFiltersChange }: SavedToolbarProps) {
  const categories = ['All', 'Electronics', 'Books', 'Furniture', 'Clothing', 'Sports', 'Other'];

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 rounded-lg border bg-card/50">
      <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
      
      {/* Category Filter */}
      <Select
        value={filters.category || 'All'}
        onValueChange={(value) => 
          onFiltersChange({ ...filters, category: value === 'All' ? undefined : value })
        }
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sort */}
      <Select
        value={filters.sort}
        onValueChange={(value: any) => onFiltersChange({ ...filters, sort: value })}
      >
        <SelectTrigger className="w-[180px]">
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

      {/* Clear Filters */}
      {(filters.category || filters.sort !== 'newest') && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFiltersChange({ sort: 'newest' })}
        >
          Clear
        </Button>
      )}
    </div>
  );
}
