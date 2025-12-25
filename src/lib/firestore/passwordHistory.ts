
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "@/firebase/client";

// This function is designed to be called from the client-side.
export function savePasswordCheck(userId: string, strength: string, entropy: number) {
  if (!firestore) {
    // This can happen if Firebase is not initialized, which is fine.
    // We just won't log the event.
    return;
  }

  const logData = {
    userId,
    strength,
    entropy,
    createdAt: serverTimestamp()
  };

  try {
    const historyCollection = collection(firestore, `users/${userId}/passwordChecks`);
    // Non-blocking write. We don't await this.
    addDoc(historyCollection, logData).catch(error => {
        console.error("Error initiating password check log:", error);
    });
  } catch (error) {
    // This might happen if the path is invalid, etc.
    // We don't want to bother the user with this, so we just log it.
    console.error("Error initiating password check log:", error);
  }
}
