

'use client';

import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { User } from 'firebase/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, type Firestore, doc, onSnapshot, DocumentData, FirestoreError } from 'firebase/firestore';
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';

// -----------------------------------------------------------------------------
// App Initialization
// -----------------------------------------------------------------------------

function getFirebaseApp() {
    if (getApps().length) {
        return getApp();
    }
    
    if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
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
// Context and Provider
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

// -----------------------------------------------------------------------------
// Hooks
// -----------------------------------------------------------------------------

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

export function useUser() {
  const context = useContext(FirebaseClientContext);
  if (context === null) {
    throw new Error('useUser must be used within a FirebaseClientProvider');
  }
  const { user, isUserLoading: loading, userError: error } = context;
  return { user, loading, error };
}

interface UseUserDocumentResult {
  document: DocumentData | null;
  loading: boolean;
  error: FirestoreError | null;
}

export function useUserDocument(uid: string | undefined): UseUserDocumentResult {
  const { firestore } = useFirebase();
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  const docRef = useMemo(() => {
    if (uid && firestore) {
      return doc(firestore, 'users', uid);
    }
    return undefined;
  }, [uid, firestore]);

  useEffect(() => {
    if (!docRef) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(docRef, 
      (docSnap) => {
        if (docSnap.exists()) {
          setDocument(docSnap.data());
        } else {
          setDocument(null);
        }
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [docRef]);

  return { document, loading, error };
}
