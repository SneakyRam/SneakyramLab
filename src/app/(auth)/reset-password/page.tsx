
'use client';

import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useAuth } from '@/hooks/use-auth'; // Keep this for user context if needed, but not for the auth instance
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, MailCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { getSdks } from '@/firebase';

export default function ResetPasswordPage() {
  // Correctly get the auth instance. It's memoized so this is safe.
  const { auth } = getSdks();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !auth) return;

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error sending reset email',
        description: error.message || 'Please check the email address and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      role="main"
      aria-labelledby="reset-title"
      className="mx-auto w-full max-w-sm border-border/60 shadow-lg shadow-black/20"
    >
      <CardHeader className="text-center">
        <CardTitle id="reset-title" className="font-headline text-2xl">Reset Your Password</CardTitle>
        {!sent && <CardDescription>Enter your email to receive a password reset link.</CardDescription>}
      </CardHeader>
      <CardContent suppressHydrationWarning>
        {sent ? (
          <div className="text-center">
            <MailCheck className="mx-auto h-12 w-12 text-success" />
            <p className="mt-4 text-muted-foreground">
              A password reset link has been sent to <strong>{email}</strong>. Please check your inbox (and spam folder).
            </p>
            <Button asChild className="mt-6 w-full">
              <Link href="/login">Back to Login</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
              />
            </div>
            <Button type="submit" disabled={loading || !email} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Reset Link
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
