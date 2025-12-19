
"use client";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { getSdks } from "@/firebase/provider";

export function logFileConversionUsage(userId: string, inputType: string, outputType: string) {
  const { firestore } = getSdks();
  if (!firestore) return;

  const logData = {
    userId,
    toolName: "File Conversion Lab",
    details: {
        from: inputType,
        to: outputType,
    },
    timestamp: serverTimestamp(),
  };

  const logsCollection = collection(firestore, "tool_usage_logs");
  addDoc(logsCollection, logData).catch(error => {
      const permissionError = new FirestorePermissionError({
          path: logsCollection.path,
          operation: 'create',
          requestResourceData: logData,
      });
      errorEmitter.emit('permission-error', permissionError);
  });
}
