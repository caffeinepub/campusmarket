import { useGetCallerUserProfile } from '../features/auth/hooks/useCurrentUserProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { data: profile, isLoading, isError, error } = useGetCallerUserProfile();

  useEffect(() => {
    if (isError && error) {
      toast.error('Failed to load profile', {
        description: error instanceof Error ? error.message : 'Please try again later',
      });
    }
  }, [isError, error]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="mb-4 text-2xl font-bold">Profile</h2>

      {isLoading ? (
        <Card className="interactive-glow">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      ) : profile ? (
        <Card className="interactive-glow animate-in fade-in slide-in-from-bottom-4 transition-all">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-sm font-medium">Campus:</span>
              <p className="text-muted-foreground">{profile.campus}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Hostel:</span>
              <p className="text-muted-foreground">{profile.hostel}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Department:</span>
              <p className="text-muted-foreground">{profile.department}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center">
          <p className="text-muted-foreground">No profile found</p>
        </div>
      )}
    </div>
  );
}
