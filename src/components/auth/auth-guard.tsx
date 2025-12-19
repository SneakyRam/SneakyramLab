'use client';

import { useUser } from '@/hooks/use-user';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else if (!user.emailVerified) {
        router.replace('/verify-email');
      }
    }
  }, [user, loading, router]);

  // While loading, show nothing to prevent layout flashes.
  // The user will be redirected if needed once loading is complete.
  if (loading) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }
  
  // If user is not authenticated or not verified, they will be redirected, so render nothing.
  if (!user || !user.emailVerified) {
    return null;
  }

  // If all checks pass, render the protected content.
  return <>{children}</>;
}
