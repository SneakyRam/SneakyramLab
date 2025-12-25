
"use client";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "@/firebase/client";


export function logHashUsage(userId: string, algorithm: string) {
  if (!firestore) return;

  const logData = {
    userId,
    toolName: `Hash Generator (${algorithm})`,
    timestamp: serverTimestamp(),
  };

  const logsCollection = collection(firestore, "tool_usage_logs");
  // Non-blocking write.
  addDoc(logsCollection, logData).catch(error => {
      console.error("Error logging hash usage:", error);
  });
}
