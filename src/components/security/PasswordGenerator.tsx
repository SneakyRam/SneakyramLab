"use client";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

export default function PasswordGenerator({ onGenerate }: { onGenerate: (p: string) => void }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const generate = () => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>/?";
    let pass = "";
    // Use crypto.getRandomValues for more secure random numbers
    const array = new Uint32Array(16);
    window.crypto.getRandomValues(array);

    for (let i = 0; i < 16; i++) {
      pass += chars[array[i] % chars.length];
    }
    onGenerate(pass);
  };

  // Prevent hydration mismatch by only rendering button on client
  if (!isClient) {
    return null;
  }

  return (
    <Button
      onClick={generate}
      variant="outline"
      size="sm"
    >
      <RefreshCw className="mr-2 h-4 w-4" />
      Generate Secure Password
    </Button>
  );
}
