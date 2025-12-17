"use client";

import { useState, useEffect, createContext, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import type { User } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // In a real app, you might fetch additional user profile data from Firestore here
        // For now, we'll just use the basic user object from Firebase Auth
        const appUser: User = {
          ...firebaseUser,
          // role: 'user', // Default role, or fetch from Firestore
        };
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="w-full max-w-md space-y-4 p-8">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
