
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRole } from '@/hooks/use-role';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection } from 'firebase/firestore';
import { useCollection } from '@/firebase';
import { useFirestore } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, ShieldCheck, ShieldOff } from 'lucide-react';
import { UserDocument } from '@/lib/types';
import AnimatedGradientText from '@/components/effects/animated-gradient-text';


export default function SecurityDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const role = useRole(user?.uid);
  const router = useRouter();
  const firestore = useFirestore();

  const [usersQuery, setUsersQuery] = useState<any>(null);

  useEffect(() => {
    if (role === 'admin' && firestore) {
      setUsersQuery(collection(firestore, 'users'));
    }
  }, [role, firestore]);

  const { data: users, isLoading: usersLoading } = useCollection<UserDocument>(usersQuery);

  useEffect(() => {
    // If auth is done loading and the user is not an admin, redirect them.
    if (!authLoading && role && role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [role, authLoading, router]);

  // Loading state: wait for auth and role to be determined.
  if (authLoading || !role) {
    return (
        <div className="container py-8">
            <Skeleton className="h-10 w-1/3 mb-8" />
            <Skeleton className="h-64 w-full" />
        </div>
    );
  }

  // If the user is not an admin, they will be redirected. Render nothing in the meantime.
  if (role !== 'admin') {
    return null;
  }
  
  const getStatusBadge = (status: string | undefined) => {
    switch(status) {
        case 'active':
            return <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20"><ShieldCheck className="h-3 w-3 mr-1"/>Active</Badge>;
        case 'locked':
            return <Badge variant="destructive"><ShieldAlert className="h-3 w-3 mr-1"/>Locked</Badge>;
        case 'deleted':
             return <Badge variant="outline"><ShieldOff className="h-3 w-3 mr-1"/>Deleted</Badge>;
        default:
            return <Badge variant="secondary"><ShieldCheck className="h-3 w-3 mr-1"/>Active</Badge>;
    }
  };

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-8">
        <AnimatedGradientText as="h1" className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
          Security Dashboard
        </AnimatedGradientText>
        <p className="text-muted-foreground mt-2">
          Monitor user roles, statuses, and security events across the platform.
        </p>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersLoading && Array.from({length: 5}).map((_, i) => (
                <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                </TableRow>
            ))}
            {users && users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.email}</TableCell>
                <TableCell>
                    <Badge variant={u.role === 'admin' ? 'default' : 'outline'}>
                        {u.role}
                    </Badge>
                </TableCell>
                <TableCell>{getStatusBadge(u.status)}</TableCell>
                <TableCell>
                  {u.lastLoginAt ? new Date(u.lastLoginAt.seconds * 1000).toLocaleString() : 'Never'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
