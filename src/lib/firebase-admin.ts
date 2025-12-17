// src/lib/firebase-admin.ts
import admin from 'firebase-admin';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : undefined;

if (!admin.apps.length) {
  if (!serviceAccount) {
    // In a production/hosted environment, service account might be auto-configured.
    // For local dev, this will throw if the env var is not set.
    console.warn('Firebase Admin SDK service account not found in environment variables. Attempting to initialize with default credentials.');
    admin.initializeApp();
  } else {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
