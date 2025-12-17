"use client";

import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  // Middleware now handles the redirect, but we can still show a loading state
  // while the initial client-side auth state is being determined.
  if (loading) {
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

  // If loading is false and there's no user, it means the user is logged out.
  // The middleware would have already redirected, but this is a fallback.
  // We can render null or a more specific "access denied" component if preferred.
  if (!user) {
    return null;
  }

  return <>{children}</>;
}
