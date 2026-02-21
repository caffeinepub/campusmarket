import { BookOpen, Laptop, Sofa, Shirt, UtensilsCrossed, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CategoryNavigationProps {
  activeCategory?: string;
  onCategorySelect: (category: string) => void;
  className?: string;
}

const CATEGORIES = [
  { id: 'Textbooks', label: 'Textbooks', icon: BookOpen },
  { id: 'Electronics', label: 'Electronics', icon: Laptop },
  { id: 'Dorm Furniture', label: 'Furniture', icon: Sofa },
  { id: 'Clothes', label: 'Clothes', icon: Shirt },
  { id: 'Kitchen Items', label: 'Kitchen', icon: UtensilsCrossed },
  { id: 'Decor', label: 'Decor', icon: Sparkles },
];

export function CategoryNavigation({ activeCategory, onCategorySelect, className }: CategoryNavigationProps) {
  return (
    <div className={cn('w-full overflow-x-auto scrollbar-hide', className)}>
      <div className="flex gap-3 pb-2 min-w-max md:min-w-0 md:justify-center">
        {CATEGORIES.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;
          
          return (
            <Button
              key={category.id}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => onCategorySelect(category.id)}
              className={cn(
                'flex items-center gap-2 rounded-xl px-4 py-2 transition-all',
                isActive && 'bg-primary text-primary-foreground shadow-sm'
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="font-medium">{category.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
