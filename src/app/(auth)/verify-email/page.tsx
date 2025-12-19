
'use client';

import { useAuth } from '@/hooks/use-auth';
import { sendEmailVerification } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, MailCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const dynamic = 'force-dynamic';

export default function VerifyEmailPage() {
  const { user, loading: userLoading } = useAuth();
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // If user is loaded and their email is verified, redirect them.
    if (!userLoading && user?.emailVerified) {
      router.replace('/dashboard');
    }
  }, [user, userLoading, router]);

  const resendVerificationEmail = async () => {
    if (!user) return;
    setIsResending(true);
    try {
      await sendEmailVerification(user);
      toast({
        title: 'Verification Email Sent',
        description: 'A new link has been sent to your email address.',
        variant: 'default',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to send verification email.',
      });
    } finally {
      setIsResending(false);
    }
  };

  if (userLoading || !user) {
    // Show a loading state or nothing while we determine the user state
    return (
        <div className="flex min-h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  // If we reach here, user is loaded but not verified
  return (
    <Card className="mx-auto w-full max-w-md border-border/60 shadow-lg shadow-black/20">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <MailCheck className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="font-headline text-2xl">Verify Your Email</CardTitle>
        <CardDescription>
          A verification link has been sent to your email address:{' '}
          <strong className="text-primary">{user.email}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-muted-foreground">
          Please click the link in that email to continue. If you don&apos;t see it, check your spam folder.
        </p>
        <Button onClick={resendVerificationEmail} disabled={isResending} className="mt-6 w-full">
          {isResending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            'Resend Verification Email'
          )}
        </Button>
         <p className="mt-4 text-xs text-muted-foreground">
            Once verified, please refresh this page or log in again.
        </p>
      </CardContent>
    </Card>
  );
}
