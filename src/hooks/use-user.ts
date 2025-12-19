

'use client';

import { useUser as useAppUser } from "@/contexts/auth-provider";

/**
 * The primary hook for accessing the user's authentication state.
 * This should be used throughout the application to get the current user.
 * It is a simple pass-through to the user state from the central Firebase provider.
 */
export function useUser() {
  return useAppUser();
}
