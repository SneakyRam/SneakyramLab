
'use client';

import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { User } from 'firebase/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';

// -----------------------------------------------------------------------------
// App Initialization
// -----------------------------------------------------------------------------

function getFirebaseApp() {
    if (getApps().length) {
        return getApp();
    }
    
    // Check for client-side environment variables
    if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      // In a real app, you might want to show a more user-friendly error.
      // For this audit, throwing an error is appropriate to signal a misconfiguration.
      throw new Error("Firebase client environment variables are not set. Please check your .env file.");
    }

    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    };

    return initializeApp(firebaseConfig);
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
    try {
        const app = getFirebaseApp();
        const auth = getAuth(app);
        const firestore = getFirestore(app);
        return { app, auth, firestore, user, isUserLoading, userError };
    } catch (error: any) {
        console.error("Firebase Initialization Error:", error.message);
        // Return a dummy context to prevent the app from crashing, but log the error.
        // In a real app, you might render a full-page error boundary.
        return {
            app: null as any,
            auth: null as any,
            firestore: null as any,
            user: null,
            isUserLoading: false,
            userError: error
        };
    }
  }, [user, isUserLoading, userError]);

  useEffect(() => {
    if (!contextValue.auth) {
        // If auth failed to initialize, don't set up the listener.
        setIsUserLoading(false);
        return;
    }
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
export function useFirebase() {
  const context = useContext(FirebaseClientContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseClientProvider');
  }
  if (!context.app) {
      throw new Error("Firebase has not been initialized. Please check your environment variables.");
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
  const { user, isUserLoading: loading, userError: error } = context;
  return { user, loading, error };
}
