
'use client';

import { useUserDocument as useAppUserDocument } from "@/firebase/provider";

/**
 * @deprecated Use `useUserDocument` from `@/firebase/provider` directly for consistency.
 */
export const useUserDocument = (uid: string | undefined) => {
  return useAppUserDocument(uid);
};
