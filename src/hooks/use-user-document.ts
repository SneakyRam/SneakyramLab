
'use client';

import { useState, useEffect, useMemo } from 'react';
import { doc, onSnapshot, DocumentData, FirestoreError } from 'firebase/firestore';
import { firestore } from '@/firebase/client';

interface UseUserDocumentResult {
  document: DocumentData | null;
  loading: boolean;
  error: FirestoreError | null;
}

export function useUserDocument(uid: string | undefined): UseUserDocumentResult {
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  const docRef = useMemo(() => {
    if (uid && firestore) {
      return doc(firestore, 'users', uid);
    }
    return undefined;
  }, [uid]);

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
