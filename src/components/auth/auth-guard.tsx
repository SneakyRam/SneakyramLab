'use client';

import { useUser } from '@/hooks/use-user';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If the auth state is finished loading...
    if (!loading) {
      // and there's no user, redirect to login.
      if (!user) {
        router.replace('/login');
      } 
      // and the user's email is not verified, redirect to the verification page.
      else if (!user.emailVerified) {
        router.replace('/verify-email');
      }
    }
  }, [user, loading, router]);

  // While the authentication state is loading, display a full-screen loader.
  // This prevents any child components from rendering prematurely and trying to access
  // user data before it's available, which was the cause of the client-side exceptions.
  if (loading) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }
  
  // If user is not authenticated or not verified, they will be redirected by the useEffect.
  // Returning null here prevents a flash of un-styled or protected content.
  if (!user || !user.emailVerified) {
    return null;
  }

  // If all checks pass, render the protected content.
  return <>{children}</>;
}
