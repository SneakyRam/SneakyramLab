// src/lib/firebase-admin.ts
import admin from 'firebase-admin';

// This is a robust way to handle the service account JSON.
// It handles both stringified JSON from an env var and the case where it's not set.
function getServiceAccount() {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccountJson) {
    // This allows initialization using Application Default Credentials
    // in environments like Cloud Run or Cloud Functions.
    return undefined;
  }
  try {
    return JSON.parse(serviceAccountJson);
  } catch (e) {
    console.error('Error parsing FIREBASE_SERVICE_ACCOUNT JSON:', e);
    return undefined;
  }
}

if (!admin.apps.length) {
  const serviceAccount = getServiceAccount();
  
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    // For local development with the emulator or environments with default credentials,
    // this will attempt to initialize without explicit credentials.
    // It will look for FIREBASE_CONFIG env var or other default credential sources.
    console.warn('Firebase Admin SDK initializing with default credentials. For production, set FIREBASE_SERVICE_ACCOUNT.');
    try {
        admin.initializeApp();
    } catch(e: any) {
        console.error("Firebase Admin SDK initialization failed. Ensure FIREBASE_CONFIG or FIREBASE_SERVICE_ACCOUNT is set.", e.message);
    }
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
