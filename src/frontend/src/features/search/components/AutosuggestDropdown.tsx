// Autosuggest dropdown with keyboard navigation
import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';

interface AutosuggestDropdownProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function AutosuggestDropdown({ suggestions, onSelect, isOpen, onClose }: AutosuggestDropdownProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || suggestions.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        onSelect(suggestions[selectedIndex]);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, suggestions, selectedIndex, onSelect, onClose]);

  if (!isOpen || suggestions.length === 0) {
    return null;
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 z-50 mt-1 rounded-lg border border-border bg-card shadow-lg max-h-60 overflow-y-auto"
    >
      {suggestions.map((suggestion, index) => (
        <button
          key={suggestion}
          onClick={() => onSelect(suggestion)}
          className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors ${
            index === selectedIndex ? 'bg-accent' : 'hover:bg-accent/50'
          }`}
        >
          <Search className="h-4 w-4 text-muted-foreground" />
          <span>{suggestion}</span>
        </button>
      ))}
    </div>
  );
}
