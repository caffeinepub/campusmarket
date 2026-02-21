import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSaveCallerUserProfile } from '../api/profile';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { ROUTES } from '../app/routes';
import { toast } from 'sonner';

export default function OnboardingPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const saveProfile = useSaveCallerUserProfile();

  const [campus, setCampus] = useState('SRM-KTR');
  const [hostel, setHostel] = useState('');
  const [department, setDepartment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identity) {
      toast.error('Not authenticated');
      return;
    }

    if (!hostel || !department) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        principal: identity.getPrincipal(),
        campus,
        hostel,
        department,
        onboarding_complete: true,
      });

      toast.success('Profile created successfully!');
      navigate({ to: ROUTES.home });
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast.error('Failed to save profile');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="interactive-glow w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>Tell us a bit about yourself to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="campus">Campus</Label>
              <Select value={campus} onValueChange={setCampus}>
                <SelectTrigger id="campus" className="transition-all focus:shadow-glow">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SRM-KTR">SRM KTR</SelectItem>
                  <SelectItem value="SRM-RMP">SRM RMP</SelectItem>
                  <SelectItem value="SRM-NCR">SRM NCR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hostel">Hostel</Label>
              <Input 
                id="hostel" 
                placeholder="e.g., Ganga, Yamuna" 
                value={hostel} 
                onChange={(e) => setHostel(e.target.value)} 
                required 
                className="transition-all focus:shadow-glow"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                placeholder="e.g., Computer Science"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                className="transition-all focus:shadow-glow"
              />
            </div>

            <Button type="submit" className="interactive-press w-full" disabled={saveProfile.isPending}>
              {saveProfile.isPending ? 'Saving...' : 'Complete Setup'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
