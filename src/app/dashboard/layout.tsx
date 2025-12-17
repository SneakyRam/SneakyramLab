"use client";

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?from=/dashboard');
    }
  }, [user, loading, router]);

  if (loading || !user) {
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

  return <>{children}</>;
}
