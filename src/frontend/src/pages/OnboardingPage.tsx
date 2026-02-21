import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useSaveCallerUserProfile } from '../api/profile';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import { ROUTES } from '../app/routes';

export default function OnboardingPage() {
  const [campus, setCampus] = useState('');
  const [hostel, setHostel] = useState('');
  const [department, setDepartment] = useState('');
  const navigate = useNavigate();
  const saveProfile = useSaveCallerUserProfile();
  const { identity } = useInternetIdentity();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identity) {
      toast.error('Not authenticated');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        principal: identity.getPrincipal(),
        campus,
        hostel,
        department,
        onboarding_complete: true,
        verified_student: false,
        star_rating: 0,
        reliability_score: 0,
        transaction_count: BigInt(0),
      });
      toast.success('Profile created successfully');
      navigate({ to: ROUTES.home });
    } catch (error) {
      toast.error('Failed to save profile');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20">
      <Card className="w-full max-w-md interactive-glow">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to Campus Marketplace</CardTitle>
          <CardDescription>Let's set up your profile to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="campus">Campus *</Label>
              <Input
                id="campus"
                placeholder="e.g., Main Campus"
                value={campus}
                onChange={(e) => setCampus(e.target.value)}
                required
                className="interactive-press"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hostel">Hostel *</Label>
              <Input
                id="hostel"
                placeholder="e.g., North Hall"
                value={hostel}
                onChange={(e) => setHostel(e.target.value)}
                required
                className="interactive-press"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                placeholder="e.g., Computer Science"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                className="interactive-press"
              />
            </div>

            <Button
              type="submit"
              className="w-full interactive-press"
              disabled={saveProfile.isPending}
            >
              {saveProfile.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Complete Setup'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
