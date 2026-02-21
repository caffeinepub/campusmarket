import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const CATEGORIES = [
  { id: 'textbooks', label: 'Textbooks', emoji: '📚' },
  { id: 'furniture', label: 'Furniture', emoji: '🪑' },
  { id: 'electronics', label: 'Electronics', emoji: '💻' },
  { id: 'clothing', label: 'Clothing', emoji: '👕' },
  { id: 'dorm-essentials', label: 'Dorm Essentials', emoji: '🛏️' },
  { id: 'course-materials', label: 'Course Materials', emoji: '📝' },
  { id: 'move-out-sales', label: 'Move-Out Sales', emoji: '📦' },
];

interface CategoryBrowseChipsProps {
  onCategorySelect: (category: string) => void;
}

export function CategoryBrowseChips({ onCategorySelect }: CategoryBrowseChipsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryId: string) => {
    const newCategory = selectedCategory === categoryId ? '' : categoryId;
    setSelectedCategory(newCategory || null);
    onCategorySelect(newCategory);
  };

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Browse by Category</h2>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <Badge
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            className={cn(
              'cursor-pointer px-4 py-2 text-sm rounded-xl motion-safe:transition-all hover:shadow-soft',
              selectedCategory === category.id
                ? 'bg-primary text-primary-foreground'
                : 'border-border/50 hover:bg-muted/50'
            )}
            onClick={() => handleCategoryClick(category.id)}
          >
            <span className="mr-1.5">{category.emoji}</span>
            {category.label}
          </Badge>
        ))}
      </div>
    </div>
  );
}
