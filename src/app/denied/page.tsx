import { ShieldOff } from "lucide-react";
import Link from "next/link";

export default function DeniedPage() {
  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.14))] flex-col items-center justify-center p-4 text-center">
      <ShieldOff className="h-16 w-16 text-destructive" />
      <h1 className="mt-6 font-headline text-3xl font-bold">
        Access Denied
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        For security reasons, access to this service is restricted. This may be
        due to your geographic location or network reputation.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        If you believe this is an error, please contact support.
      </p>
      <Link href="/" className="mt-8 text-sm font-semibold text-primary hover:underline">
        Go back to the Home Page
      </Link>
    </div>
  );
}
