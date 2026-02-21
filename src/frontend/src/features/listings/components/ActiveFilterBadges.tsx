import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { ProductCondition } from '../../../backend';
import type { ListingFilters } from '../filters/filterState';

interface ActiveFilterBadgesProps {
  filters: ListingFilters;
  onRemoveCategory: (category: string) => void;
  onRemoveCondition: (condition: ProductCondition) => void;
  onRemoveLocation: (type: 'dorms' | 'buildings' | 'zones', location: string) => void;
  onClearPrice: () => void;
  onClearAll: () => void;
}

export function ActiveFilterBadges({
  filters,
  onRemoveCategory,
  onRemoveCondition,
  onRemoveLocation,
  onClearPrice,
  onClearAll,
}: ActiveFilterBadgesProps) {
  const hasFilters =
    filters.categories.length > 0 ||
    filters.conditions.length > 0 ||
    filters.priceMin !== undefined ||
    filters.priceMax !== undefined ||
    filters.campusLocations.dorms.length > 0 ||
    filters.campusLocations.buildings.length > 0 ||
    filters.campusLocations.zones.length > 0;

  if (!hasFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-muted/30 rounded-xl">
      <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
      
      {filters.categories.map((category) => (
        <Badge key={category} variant="secondary" className="gap-1.5 pr-1">
          {category}
          <button
            onClick={() => onRemoveCategory(category)}
            className="ml-1 rounded-full hover:bg-background/50 p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {filters.conditions.map((condition) => (
        <Badge key={condition} variant="secondary" className="gap-1.5 pr-1">
          {condition}
          <button
            onClick={() => onRemoveCondition(condition)}
            className="ml-1 rounded-full hover:bg-background/50 p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {(filters.priceMin !== undefined || filters.priceMax !== undefined) && (
        <Badge variant="secondary" className="gap-1.5 pr-1">
          ₹{filters.priceMin || 0} - ₹{filters.priceMax || '∞'}
          <button
            onClick={onClearPrice}
            className="ml-1 rounded-full hover:bg-background/50 p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {filters.campusLocations.dorms.map((dorm) => (
        <Badge key={dorm} variant="secondary" className="gap-1.5 pr-1">
          {dorm}
          <button
            onClick={() => onRemoveLocation('dorms', dorm)}
            className="ml-1 rounded-full hover:bg-background/50 p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {filters.campusLocations.buildings.map((building) => (
        <Badge key={building} variant="secondary" className="gap-1.5 pr-1">
          {building}
          <button
            onClick={() => onRemoveLocation('buildings', building)}
            className="ml-1 rounded-full hover:bg-background/50 p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {filters.campusLocations.zones.map((zone) => (
        <Badge key={zone} variant="secondary" className="gap-1.5 pr-1">
          {zone}
          <button
            onClick={() => onRemoveLocation('zones', zone)}
            className="ml-1 rounded-full hover:bg-background/50 p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      <Button variant="ghost" size="sm" onClick={onClearAll} className="text-primary hover:text-primary/80 ml-auto">
        Clear All
      </Button>
    </div>
  );
}
