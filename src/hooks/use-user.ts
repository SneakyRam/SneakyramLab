'use client';

import { useUser as useFirebaseUser } from '@/firebase/provider';

/**
 * The primary hook for accessing the user's authentication state.
 * This should be used throughout the application to get the current user.
 * It is a simple pass-through to the user state from the central Firebase provider.
 */
export function useUser() {
  // The isUserLoading state was renamed to 'loading' in the original implementation,
  // this hook standardizes it back to 'loading' for consistency.
  const { user, isUserLoading: loading } = useFirebaseUser();
  return { user, loading };
}
