import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';
import type { SellWizardFormData } from '../sellWizardTypes';
import { Variant_dorm_zone_building_meetupSpot, type LocationDetail } from '../../../../backend';

interface LocationStepProps {
  data: SellWizardFormData;
  onChange: (field: keyof SellWizardFormData, value: LocationDetail[]) => void;
}

const DORMS = ['North Hall', 'South Hall', 'East Tower', 'West Wing'];
const BUILDINGS = ['Library', 'Student Center', 'Admin Building', 'Sports Complex'];
const ZONES = ['North Campus', 'South Campus', 'Central Campus'];
const MEETUP_SPOTS = ['Library', 'Cafeteria', 'Student Center', 'Common Areas'];

export function LocationStep({ data, onChange }: LocationStepProps) {
  const toggleLocation = (name: string, type: Variant_dorm_zone_building_meetupSpot) => {
    const exists = data.meetup_locations.some(loc => loc.name === name && loc.location_type === type);
    
    if (exists) {
      onChange('meetup_locations', data.meetup_locations.filter(loc => !(loc.name === name && loc.location_type === type)));
    } else {
      onChange('meetup_locations', [
        ...data.meetup_locations,
        { name, location_type: type, coordinates: [0, 0] },
      ]);
    }
  };

  const isSelected = (name: string, type: Variant_dorm_zone_building_meetupSpot) => {
    return data.meetup_locations.some(loc => loc.name === name && loc.location_type === type);
  };

  return (
    <Card className="interactive-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Campus Meetup Locations
        </CardTitle>
        <CardDescription>Select where you'd like to meet buyers (select at least one)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Dorm</h4>
          <div className="grid grid-cols-2 gap-3">
            {DORMS.map((dorm) => (
              <div key={dorm} className="flex items-center space-x-2">
                <Checkbox
                  id={`dorm-${dorm}`}
                  checked={isSelected(dorm, Variant_dorm_zone_building_meetupSpot.dorm)}
                  onCheckedChange={() => toggleLocation(dorm, Variant_dorm_zone_building_meetupSpot.dorm)}
                />
                <Label htmlFor={`dorm-${dorm}`} className="cursor-pointer text-sm font-normal">
                  {dorm}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-sm">Building</h4>
          <div className="grid grid-cols-2 gap-3">
            {BUILDINGS.map((building) => (
              <div key={building} className="flex items-center space-x-2">
                <Checkbox
                  id={`building-${building}`}
                  checked={isSelected(building, Variant_dorm_zone_building_meetupSpot.building)}
                  onCheckedChange={() => toggleLocation(building, Variant_dorm_zone_building_meetupSpot.building)}
                />
                <Label htmlFor={`building-${building}`} className="cursor-pointer text-sm font-normal">
                  {building}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-sm">Zone</h4>
          <div className="grid grid-cols-2 gap-3">
            {ZONES.map((zone) => (
              <div key={zone} className="flex items-center space-x-2">
                <Checkbox
                  id={`zone-${zone}`}
                  checked={isSelected(zone, Variant_dorm_zone_building_meetupSpot.zone)}
                  onCheckedChange={() => toggleLocation(zone, Variant_dorm_zone_building_meetupSpot.zone)}
                />
                <Label htmlFor={`zone-${zone}`} className="cursor-pointer text-sm font-normal">
                  {zone}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t">
          <h4 className="font-medium text-sm">Suggested Meetup Spots (Optional)</h4>
          <p className="text-xs text-muted-foreground">Public, high-traffic areas for safe exchanges</p>
          <div className="grid grid-cols-2 gap-3">
            {MEETUP_SPOTS.map((spot) => (
              <div key={spot} className="flex items-center space-x-2">
                <Checkbox
                  id={`meetup-${spot}`}
                  checked={isSelected(spot, Variant_dorm_zone_building_meetupSpot.meetupSpot)}
                  onCheckedChange={() => toggleLocation(spot, Variant_dorm_zone_building_meetupSpot.meetupSpot)}
                />
                <Label htmlFor={`meetup-${spot}`} className="cursor-pointer text-sm font-normal">
                  {spot}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
