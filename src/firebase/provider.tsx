'use client';

import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { User } from 'firebase/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { firebaseConfig } from './config';

// -----------------------------------------------------------------------------
// App Initialization
// -----------------------------------------------------------------------------

function getFirebaseApp() {
    if (getApps().length) {
        return getApp();
    }
    
    try {
        return initializeApp();
    } catch (e) {
        if (process.env.NODE_ENV === 'production') {
            console.warn('Automatic initialization failed. Falling back to firebase config object.', e);
        }
        return initializeApp(firebaseConfig);
    }
}

// -----------------------------------------------------------------------------
// Auth Context and Hooks
// -----------------------------------------------------------------------------

interface FirebaseClientContextValue {
  app: FirebaseApp;
  auth: ReturnType<typeof getAuth>;
  firestore: Firestore;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

const FirebaseClientContext = createContext<FirebaseClientContextValue | null>(null);

/**
 * Provides the core Firebase SDK instances (app, auth, firestore) and
 * the current user's authentication state to all descendant components.
 */
export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [userError, setUserError] = useState<Error | null>(null);

  const contextValue = useMemo(() => {
    const app = getFirebaseApp();
    const auth = getAuth(app);
    const firestore = getFirestore(app);

    return { app, auth, firestore, user, isUserLoading, userError };
  }, [user, isUserLoading, userError]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      contextValue.auth,
      (user) => {
        setUser(user);
        setIsUserLoading(false);
      },
      (error) => {
        setUserError(error);
        setIsUserLoading(false);
      }
    );
    return () => unsubscribe();
  }, [contextValue.auth]);

  return (
    <FirebaseClientContext.Provider value={contextValue}>
      {children}
    </FirebaseClientContext.Provider>
  );
}

/**
 * Hook to access the raw Firebase SDK instances.
 * Prefer using more specific hooks like `useUser` if you only need auth state.
 */
export function getSdks() {
  const context = useContext(FirebaseClientContext);
  if (!context) {
    throw new Error('getSdks must be used within a FirebaseClientProvider');
  }
  return context;
}


/**
 * The primary hook for accessing the user's authentication state.
 * This should be used throughout the application to get the current user.
 */
export function useUser() {
  const context = useContext(FirebaseClientContext);
  if (context === null) {
    throw new Error('useUser must be used within a FirebaseClientProvider');
  }
  const { user, isUserLoading, userError } = context;
  return { user, isUserLoading, userError };
}
