'use client';

import { useUser as useFirebaseUser } from '@/firebase';

/**
 * @deprecated Use `useUser` from `@/firebase` directly for consistency.
 */
export const useAuth = () => {
  const { user, isUserLoading, userError } = useFirebaseUser();
  return { user, loading: isUserLoading, error: userError };
};
