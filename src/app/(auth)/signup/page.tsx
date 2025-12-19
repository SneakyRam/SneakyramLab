

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AuthForm from "@/components/auth/auth-form";
import { Logo } from "@/components/logo";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function AuthFormSkeleton() {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
        </div>
    )
}


export default function SignupPage() {
  return (
    <Card className="mx-auto w-full max-w-sm border-border/60 shadow-lg shadow-black/20">
      <CardHeader className="items-center text-center">
        <div className="mb-4">
            <Logo />
        </div>
        <CardTitle className="font-headline text-2xl">
          Create an Account
        </CardTitle>
        <CardDescription>
          Enter your email and password to get started.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<AuthFormSkeleton />}>
            <AuthForm mode="signup" />
        </Suspense>
        <p className="mt-4 px-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            Log In
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
