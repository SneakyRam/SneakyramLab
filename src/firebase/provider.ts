
'use client';
import { auth, firestore } from '@/firebase/client';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { useMemo } from 'react';

// A hook that returns the auth and firestore instances.
// This is used by other client-side hooks like useCollection and useDoc.
export function useFirebase(): {
  firebaseApp?: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
} {
  return useMemo(
    () => ({
      auth,
      firestore,
    }),
    []
  );
}
