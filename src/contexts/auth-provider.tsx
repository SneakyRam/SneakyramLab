'use client';

import { createContext, ReactNode } from 'react';
import { FirebaseClientProvider } from '@/firebase/provider';

// This context is now simplified, as the provider logic is handled by FirebaseClientProvider
const AuthContext = createContext(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    return (
        <FirebaseClientProvider>
            {children}
        </FirebaseClientProvider>
    )
}
