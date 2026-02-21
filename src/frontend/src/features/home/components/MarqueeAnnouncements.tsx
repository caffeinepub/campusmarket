// Marquee announcements strip for Home dashboard
import { Card } from '@/components/ui/card';
import { Megaphone } from 'lucide-react';

const ANNOUNCEMENTS = [
  'Welcome to CampusMarket! Buy and sell safely on campus.',
  'New listings added daily - check back often!',
  'Meet in public places for safe transactions.',
];

export function MarqueeAnnouncements() {
  return (
    <Card className="mb-6 overflow-hidden border-border/50 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 backdrop-blur-sm">
      <div className="flex items-center gap-3 px-4 py-3">
        <Megaphone className="h-5 w-5 flex-shrink-0 text-primary" />
        <div className="flex-1 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap text-sm font-medium">
            {ANNOUNCEMENTS.map((announcement, i) => (
              <span key={i} className="mx-8">
                {announcement}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
