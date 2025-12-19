
'use client';

import { useState, useEffect } from 'react';
import { useUserDocument } from '@/firebase/provider';
import type { UserRole } from '@/lib/types';

/**
 * A client-side hook to get the user's role in real-time.
 * @param uid - The user's ID.
 * @returns The user's role ('user' or 'admin'), defaulting to 'user'.
 */
export function useRole(uid: string | undefined): UserRole {
  const { document: userDoc } = useUserDocument(uid);
  const [role, setRole] = useState<UserRole>('user');

  useEffect(() => {
    if (userDoc) {
      setRole((userDoc as any).role || 'user');
    }
  }, [userDoc]);

  return role;
}
