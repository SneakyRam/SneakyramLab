
'use client';

import { useState, useEffect, useMemo } from 'react';
import { doc, onSnapshot, DocumentData, FirestoreError } from 'firebase/firestore';
import { useFirebase } from '@/firebase/provider';

interface UseUserDocumentResult {
  document: DocumentData | null;
  loading: boolean;
  error: FirestoreError | null;
}

/**
 * A client-side hook to subscribe to a user's document from the 'users' collection.
 * @param uid The user's ID. If undefined, the hook will not fetch data.
 * @returns An object containing the user document, loading state, and any errors.
 */
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
