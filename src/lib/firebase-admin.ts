
import 'server-only';

import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

function initAdmin(): void {
  if (getApps().length === 0) {
    // This check is crucial for the Vercel build process.
    if (!process.env.FIREBASE_PROJECT_ID) {
      // Don't throw an error, just exit. The build process will try to run this
      // without env vars, and that's okay. It should just not initialize.
      // At runtime, the env vars will be present.
      return;
    }

    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        // The private key might have newline characters that need to be parsed correctly.
        privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      }),
    });
  }
}

// Lazy-loaded getter for the Admin Auth service.
export function getAdminAuth(): Auth {
  initAdmin();
  return getAuth();
}

// Lazy-loaded getter for the Admin Firestore service.
export function getAdminDb(): Firestore {
  initAdmin();
  return getFirestore();
}
