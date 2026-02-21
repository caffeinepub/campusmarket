import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ProductCondition } from '../../../backend';
import { ConditionBadge } from './ConditionBadge';
import { BookOpen, Laptop, Sofa, Shirt, UtensilsCrossed, Sparkles } from 'lucide-react';
import type { ListingFilters, LocationFilters } from '../filters/filterState';

interface FilterSidebarProps {
  filters: ListingFilters;
  onToggleCategory: (category: string) => void;
  onToggleCondition: (condition: ProductCondition) => void;
  onToggleLocation: (type: keyof LocationFilters, location: string) => void;
  onPriceChange: (min?: number, max?: number) => void;
  onReset: () => void;
}

const CATEGORIES = [
  { id: 'Textbooks', label: 'Textbooks', icon: BookOpen },
  { id: 'Electronics', label: 'Electronics', icon: Laptop },
  { id: 'Dorm Furniture', label: 'Dorm Furniture', icon: Sofa },
  { id: 'Clothes', label: 'Clothes', icon: Shirt },
  { id: 'Kitchen Items', label: 'Kitchen Items', icon: UtensilsCrossed },
  { id: 'Decor', label: 'Decor', icon: Sparkles },
];

const CONDITIONS = [
  ProductCondition.likeNew,
  ProductCondition.good,
  ProductCondition.fair,
  ProductCondition.wellUsed,
];

const PRICE_RANGES = [
  { label: '₹0 - ₹500', min: 0, max: 500 },
  { label: '₹500 - ₹1,000', min: 500, max: 1000 },
  { label: '₹1,000 - ₹2,500', min: 1000, max: 2500 },
  { label: '₹2,500 - ₹5,000', min: 2500, max: 5000 },
  { label: '₹5,000+', min: 5000, max: undefined },
];

const DORMS = ['North Hall', 'South Hall', 'East Tower', 'West Wing'];
const BUILDINGS = ['Library', 'Student Center', 'Admin Building', 'Sports Complex'];
const ZONES = ['North Campus', 'South Campus', 'Central Campus'];

export function FilterSidebar({
  filters,
  onToggleCategory,
  onToggleCondition,
  onToggleLocation,
  onPriceChange,
  onReset,
}: FilterSidebarProps) {
  return (
    <div className="w-full space-y-6 p-6 bg-card rounded-xl border border-border/40 shadow-xs">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button variant="ghost" size="sm" onClick={onReset} className="text-primary hover:text-primary/80">
          Clear All
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={['categories', 'price', 'condition']} className="space-y-2">
        {/* Categories */}
        <AccordionItem value="categories" className="border-0">
          <AccordionTrigger className="py-3 hover:no-underline">
            <span className="font-medium">Categories</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pt-2">
            {CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={filters.categories.includes(category.id)}
                    onCheckedChange={() => onToggleCategory(category.id)}
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="flex items-center gap-2 cursor-pointer text-sm font-normal"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    {category.label}
                  </Label>
                </div>
              );
            })}
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price" className="border-0">
          <AccordionTrigger className="py-3 hover:no-underline">
            <span className="font-medium">Price Range</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="price-min" className="text-xs">Min</Label>
                <Input
                  id="price-min"
                  type="number"
                  placeholder="₹0"
                  value={filters.priceMin || ''}
                  onChange={(e) => onPriceChange(Number(e.target.value) || undefined, filters.priceMax)}
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="price-max" className="text-xs">Max</Label>
                <Input
                  id="price-max"
                  type="number"
                  placeholder="Any"
                  value={filters.priceMax || ''}
                  onChange={(e) => onPriceChange(filters.priceMin, Number(e.target.value) || undefined)}
                  className="h-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              {PRICE_RANGES.map((range) => (
                <Button
                  key={range.label}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => onPriceChange(range.min, range.max)}
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Condition */}
        <AccordionItem value="condition" className="border-0">
          <AccordionTrigger className="py-3 hover:no-underline">
            <span className="font-medium">Condition</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pt-2">
            {CONDITIONS.map((condition) => (
              <div key={condition} className="flex items-center space-x-3">
                <Checkbox
                  id={`condition-${condition}`}
                  checked={filters.conditions.includes(condition)}
                  onCheckedChange={() => onToggleCondition(condition)}
                />
                <Label htmlFor={`condition-${condition}`} className="cursor-pointer flex-1">
                  <ConditionBadge condition={condition} showIndicator />
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Campus Location */}
        <AccordionItem value="location" className="border-0">
          <AccordionTrigger className="py-3 hover:no-underline">
            <span className="font-medium">Campus Location</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Dorm</h4>
              {DORMS.map((dorm) => (
                <div key={dorm} className="flex items-center space-x-3">
                  <Checkbox
                    id={`dorm-${dorm}`}
                    checked={filters.campusLocations.dorms.includes(dorm)}
                    onCheckedChange={() => onToggleLocation('dorms', dorm)}
                  />
                  <Label htmlFor={`dorm-${dorm}`} className="cursor-pointer text-sm font-normal">
                    {dorm}
                  </Label>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Building</h4>
              {BUILDINGS.map((building) => (
                <div key={building} className="flex items-center space-x-3">
                  <Checkbox
                    id={`building-${building}`}
                    checked={filters.campusLocations.buildings.includes(building)}
                    onCheckedChange={() => onToggleLocation('buildings', building)}
                  />
                  <Label htmlFor={`building-${building}`} className="cursor-pointer text-sm font-normal">
                    {building}
                  </Label>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Zone</h4>
              {ZONES.map((zone) => (
                <div key={zone} className="flex items-center space-x-3">
                  <Checkbox
                    id={`zone-${zone}`}
                    checked={filters.campusLocations.zones.includes(zone)}
                    onCheckedChange={() => onToggleLocation('zones', zone)}
                  />
                  <Label htmlFor={`zone-${zone}`} className="cursor-pointer text-sm font-normal">
                    {zone}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
