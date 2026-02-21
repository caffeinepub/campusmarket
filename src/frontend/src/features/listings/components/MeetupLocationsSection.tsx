import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Building, Home, Map } from 'lucide-react';
import type { LocationDetail } from '../../../backend';
import { Variant_dorm_zone_building_meetupSpot } from '../../../backend';

interface MeetupLocationsSectionProps {
  locations: LocationDetail[];
  className?: string;
}

const locationIcons = {
  [Variant_dorm_zone_building_meetupSpot.meetupSpot]: MapPin,
  [Variant_dorm_zone_building_meetupSpot.building]: Building,
  [Variant_dorm_zone_building_meetupSpot.dorm]: Home,
  [Variant_dorm_zone_building_meetupSpot.zone]: Map,
};

export function MeetupLocationsSection({ locations, className }: MeetupLocationsSectionProps) {
  const meetupSpots = locations.filter(loc => loc.location_type === Variant_dorm_zone_building_meetupSpot.meetupSpot);
  
  if (meetupSpots.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Suggested Campus Meetup Spots
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            For safe exchanges, consider meeting at public high-traffic areas like the Library, Cafeteria, or Student Center.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Suggested Campus Meetup Spots
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">Safe public meeting locations</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {meetupSpots.map((location, index) => {
            const Icon = locationIcons[location.location_type];
            return (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg border border-border/40 bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <Icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{location.name}</p>
                  {location.coordinates && (
                    <p className="text-xs text-muted-foreground truncate">
                      {location.coordinates[0].toFixed(4)}, {location.coordinates[1].toFixed(4)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
