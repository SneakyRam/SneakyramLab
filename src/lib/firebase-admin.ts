import 'server-only';

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// This function initializes the Firebase Admin SDK.
// It checks if an app is already initialized to prevent re-initialization.
// It uses environment variables for credentials, making it secure and deployable.
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // The private key might have newline characters that need to be parsed correctly.
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

// Export the initialized admin services.
export const adminAuth = getAuth();
export const adminDb = getFirestore();
