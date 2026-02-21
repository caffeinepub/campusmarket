import { BookOpen, Laptop, Sofa, Shirt, UtensilsCrossed, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CategoryGridMobileProps {
  onCategorySelect: (category: string) => void;
  className?: string;
}

const CATEGORIES = [
  { id: 'Textbooks', label: 'Textbooks', icon: BookOpen, color: 'text-blue-500' },
  { id: 'Electronics', label: 'Electronics', icon: Laptop, color: 'text-purple-500' },
  { id: 'Dorm Furniture', label: 'Furniture', icon: Sofa, color: 'text-amber-500' },
  { id: 'Clothes', label: 'Clothes', icon: Shirt, color: 'text-pink-500' },
  { id: 'Kitchen Items', label: 'Kitchen', icon: UtensilsCrossed, color: 'text-green-500' },
  { id: 'Decor', label: 'Decor', icon: Sparkles, color: 'text-orange-500' },
];

export function CategoryGridMobile({ onCategorySelect, className }: CategoryGridMobileProps) {
  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-3 gap-3', className)}>
      {CATEGORIES.map((category) => {
        const Icon = category.icon;
        
        return (
          <Card
            key={category.id}
            className="cursor-pointer hover:shadow-card transition-all active:scale-95"
            onClick={() => onCategorySelect(category.id)}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 space-y-2">
              <div className={cn('p-3 rounded-full bg-muted/50', category.color)}>
                <Icon className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium text-center">{category.label}</span>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
