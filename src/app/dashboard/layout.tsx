"use client";

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserDocument } from '@/hooks/use-user-document';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useAuth();
  const { document: userDoc, loading: docLoading } = useUserDocument(user?.uid);
  const router = useRouter();

  useEffect(() => {
    // If auth has loaded and there's no user, redirect to login.
    if (!authLoading && !user) {
      router.replace('/login');
      return;
    }
    
    // If auth has loaded and user exists, but their doc shows they are banned/deleted.
    if (user && userDoc && (userDoc as any).status === 'deleted') {
      // Here you could sign them out and redirect.
      // For now, we'll just redirect.
      router.replace('/login?reason=account_deleted');
      return;
    }

  }, [user, authLoading, userDoc, router]);

  // Show loading skeleton if either auth state or user document is loading.
  if (authLoading || docLoading) {
    return (
        <div className="container py-8">
            <Skeleton className="h-12 w-1/4 mb-8" />
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-64 w-full md:col-span-2" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    );
  }

  // If loading is false and there's no user, it means the redirect is in progress.
  // Render nothing to avoid a flash of content.
  if (!user) {
    return null;
  }

  return <>{children}</>;
}
