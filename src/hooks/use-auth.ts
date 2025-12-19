
'use client';

import { useUser as useFirebaseUser } from '@/firebase/provider';

/**
 * @deprecated Use `useUser` from `@/hooks/use-user` directly for consistency.
 */
export const useAuth = () => {
  const { user, isUserLoading, userError } = useFirebaseUser();
  return { user, loading: isUserLoading, error: userError };
};
