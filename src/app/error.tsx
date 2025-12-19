
'use client'; 

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <h2 className="font-headline text-3xl font-bold">Something went wrong!</h2>
      <p className="mt-4 text-muted-foreground">
        A client-side error occurred. Please try again.
      </p>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
        className="mt-6"
      >
        Try again
      </Button>
    </div>
  );
}
