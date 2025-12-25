
"use client";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "@/firebase/client";

export function logFileConversionUsage(userId: string, inputType: string, outputType: string) {
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
  // This is a non-blocking write. We don't await it.
  // Error handling (e.g., for permissions) should be done via a centralized listener if needed.
  addDoc(logsCollection, logData).catch(error => {
      console.error("Error logging file conversion:", error);
  });
}
