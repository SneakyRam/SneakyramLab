
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth, firestore } from '@/firebase/client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' }),
});

type UserFormValue = z.infer<typeof formSchema>;

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    ></path>
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    ></path>
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    ></path>
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    ></path>
    <path d="M1 1h22v22H1z" fill="none"></path>
  </svg>
);

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setIsGoogleLoading(true);
    getRedirectResult(auth)
        .then((result) => {
            if (result) {
                handleAuthSuccess(result.user);
            }
        })
        .catch((error) => {
            handleAuthError(error);
        })
        .finally(() => {
            setIsGoogleLoading(false);
        });
  }, []);

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  const createFirestoreUser = async (user: FirebaseUser) => {
    if (!firestore) return;
    const userRef = doc(firestore, 'users', user.uid);

    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return; 
    }

    const userData = {
      id: user.uid,
      email: user.email,
      displayName: user.displayName,
      role: 'user', // Default role for all new users
      createdAt: serverTimestamp(),
    };

    setDoc(userRef, userData).catch((error) => {
      console.error('Error creating user document:', error);
      const permissionError = new FirestorePermissionError({
        path: userRef.path,
        operation: 'create',
        requestResourceData: userData,
      });
      errorEmitter.emit('permission-error', permissionError);
    });
  };

  const handleAuthSuccess = async (user: FirebaseUser) => {
    await createFirestoreUser(user);
    const idToken = await user.getIdToken();
    
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });

    if (mode === 'signup' && !user.emailVerified) {
        await sendEmailVerification(user);
        router.push('/verify-email');
    } else {
        const from = searchParams.get('from') || '/dashboard';
        router.replace(from);
    }
  };

  const handleAuthError = (error: any) => {
    let description = 'An unexpected error occurred. Please try again.';
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      description = 'Invalid email or password. Please try again.';
    } else if (error.code === 'auth/email-already-in-use') {
      description = 'An account with this email address already exists.';
    } else if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
      description = 'The sign-in flow was cancelled.';
    }
    toast({
      variant: 'destructive',
      title: 'Authentication failed',
      description: error.message || description,
    });
  };

  const onSubmit = async (data: UserFormValue) => {
    if (!auth || isLoading || isGoogleLoading) return;
    setIsLoading(true);
    try {
      let userCredential;
      if (mode === 'signup') {
        userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      }
      await handleAuthSuccess(userCredential.user);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const googleSignIn = async () => {
    if (!auth || isLoading || isGoogleLoading) return;
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      handleAuthError(error);
      setIsGoogleLoading(false);
    }
  };

  if (!isClient) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <div className="h-4 w-1/4 bg-muted rounded-md animate-pulse" />
                <div className="h-10 w-full bg-muted rounded-md animate-pulse" />
            </div>
            <div className="space-y-2">
                <div className="h-4 w-1/4 bg-muted rounded-md animate-pulse" />
                <div className="h-10 w-full bg-muted rounded-md animate-pulse" />
            </div>
            <div className="h-10 w-full bg-muted rounded-md animate-pulse" />
        </div>
    );
  }

  return (
    <div className={cn('grid gap-6')}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    disabled={isLoading || isGoogleLoading}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    suppressHydrationWarning
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    disabled={isLoading || isGoogleLoading}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    suppressHydrationWarning
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={isLoading || isGoogleLoading}
            className="w-full"
            type="submit"
          >
            {(isLoading || isGoogleLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'login' ? 'Sign In' : 'Create account'}
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading || isGoogleLoading}
        onClick={googleSignIn}
      >
        {isGoogleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <GoogleIcon />
        )}
        Google
      </Button>
    </div>
  );
}
