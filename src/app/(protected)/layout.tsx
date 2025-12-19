
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUserDocument } from '@/hooks/use-user-document';
import { getAuth, signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useAuth();
  const { document: userDoc, loading: docLoading } = useUserDocument(user?.uid);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (authLoading || docLoading) return; // Wait until all data is loaded

    // If auth is done and there's no user, redirect to login.
    if (!user) {
      router.replace('/login');
      return;
    }
    
    // Check for a deleted or locked status from the Firestore document.
    const status = (userDoc as any)?.status;
    if (status === 'deleted' || status === 'locked') {
        const reason = status === 'deleted' ? 'Your account has been deleted.' : 'Your account has been locked for security reasons.';
        toast({
            variant: 'destructive',
            title: 'Access Denied',
            description: reason,
        });
        
        // Sign the user out on the client and then redirect.
        const auth = getAuth();
        signOut(auth).then(() => {
            router.replace('/login');
        });
        return;
    }

    // If user exists but their email is not verified, redirect to verification page.
    if (!user.emailVerified) {
        // Allow access to the verify-email page itself.
        if (window.location.pathname !== '/verify-email') {
            router.replace('/verify-email');
        }
    }

  }, [user, userDoc, authLoading, docLoading, router, toast]);

  // Show a full-page loading spinner while we're determining auth state and user doc status.
  if (authLoading || docLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  // If we are about to redirect, render nothing to avoid content flash.
  if (!user || (userDoc as any)?.status === 'deleted' || (userDoc as any)?.status === 'locked' || !user.emailVerified) {
    return null;
  }
  
  // If all checks pass, render the children.
  return <>{children}</>;
}
