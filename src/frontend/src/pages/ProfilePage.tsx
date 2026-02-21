import { useGetCallerUserProfile } from '../api/profile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { VerifiedBadge } from '../features/trustSafety/badges/VerifiedBadge';
import { SellerRating } from '../features/trustSafety/badges/SellerRating';
import { ThemeToggle } from '../features/theme/ThemeToggle';
import type { UserProfile } from '../backend';

export default function ProfilePage() {
  const { data: profile, isLoading } = useGetCallerUserProfile();

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-6 pb-24">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Profile not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userProfile = profile as UserProfile;

  return (
    <div className="container mx-auto px-4 py-6 pb-24 max-w-2xl space-y-6">
      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                {userProfile.principal.toString().slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{userProfile.principal.toString().slice(0, 8)}...</h2>
                <VerifiedBadge verified={userProfile.verified_student} />
              </div>
              <SellerRating
                rating={userProfile.star_rating}
                transactionCount={userProfile.transaction_count}
                showCount={true}
              />
            </div>
          </div>

          {/* Campus Info */}
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Campus</p>
              <Badge variant="secondary" className="text-sm">
                {userProfile.campus}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Hostel</p>
              <Badge variant="secondary" className="text-sm">
                {userProfile.hostel}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Department</p>
              <Badge variant="secondary" className="text-sm">
                {userProfile.department}
              </Badge>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="pt-4 border-t">
            <h3 className="text-sm font-semibold mb-3">Trust Score</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold text-primary">{userProfile.reliability_score.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Reliability Score</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{Number(userProfile.transaction_count)}</p>
                <p className="text-xs text-muted-foreground">Transactions</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-sm text-muted-foreground">Switch between light and dark mode</p>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6 pb-24 max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-24" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
