
'use client';

import { useUser as useAppUser } from '@/hooks/use-user';

/**
 * @deprecated Use `useUser` from `@/hooks/use-user` directly for consistency.
 */
export const useAuth = () => {
  const { user, loading } = useAppUser();
  return { user, loading, error: null }; // Adjusted to match expected return
};
