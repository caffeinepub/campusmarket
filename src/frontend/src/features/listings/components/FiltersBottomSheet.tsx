import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { HomeFilters } from '../filters/homeFeedFilters';
import type { SortOption } from '../filters/sortOptions';
import { SORT_OPTIONS } from '../filters/sortOptions';

interface FiltersBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: HomeFilters;
  onFiltersChange: (filters: HomeFilters) => void;
}

const CATEGORIES = ['All', 'Textbooks', 'Electronics', 'Dorm Furniture', 'Clothes', 'Kitchen Items', 'Decor'];

export function FiltersBottomSheet({ open, onOpenChange, filters, onFiltersChange }: FiltersBottomSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle>Filters & Sort</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select
              value={filters.category || 'All'}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, category: value === 'All' ? undefined : value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Sort By</label>
            <Select
              value={filters.sort}
              onValueChange={(value: SortOption) => onFiltersChange({ ...filters, sort: value })}
            >
              <SelectTrigger>
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
          </div>

          {/* Clear Filters */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() =>
              onFiltersChange({
                sort: 'newest',
              })
            }
          >
            Clear All Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
