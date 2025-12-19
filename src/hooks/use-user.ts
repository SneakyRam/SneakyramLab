

'use client';

import { useFirebase } from "@/firebase/provider";

/**
 * The primary hook for accessing the user's authentication state.
 * This should be used throughout the application to get the current user.
 * It is a simple pass-through to the user state from the central Firebase provider.
 */
export function useUser() {
  const { user, isUserLoading: loading, userError: error } = useFirebase();
  return { user, loading, error };
}
