import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { getSdks } from "@/firebase";

export function logHashUsage(userId: string, algorithm: string) {
  const { firestore } = getSdks();
  if (!firestore) return;

  const logData = {
    userId,
    toolName: `Hash Generator (${algorithm})`,
    timestamp: serverTimestamp(),
  };

  try {
    const logsCollection = collection(firestore, "tool_usage_logs");
    addDoc(logsCollection, logData).catch(error => {
        const permissionError = new FirestorePermissionError({
            path: logsCollection.path,
            operation: 'create',
            requestResourceData: logData,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
  } catch (error) {
    console.error("Error initiating hash usage log:", error);
  }
}
