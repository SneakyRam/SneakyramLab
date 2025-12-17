'use client';

import { useUser as useFirebaseUser } from '@/firebase';

export const useAuth = () => {
  const { user, isUserLoading, userError } = useFirebaseUser();
  return { user, loading: isUserLoading, error: userError };
};
