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

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <Card
      role="main"
      aria-labelledby="login-title"
      className="mx-auto w-full max-w-sm border-border/60 shadow-lg shadow-black/20"
    >
      <CardHeader className="items-center text-center">
        <div className="mb-4">
            <Logo />
        </div>
        <CardTitle id="login-title" className="font-headline text-2xl">
          Welcome Back
        </CardTitle>
        <CardDescription>
          Enter your credentials to access your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<div>Loading...</div>}>
            <AuthForm mode="login" />
        </Suspense>
        <div className="mt-4 text-center text-sm">
           <Link
            href="/reset-password"
            className="underline underline-offset-4 hover:text-primary"
          >
            Forgot your password?
          </Link>
        </div>
        <p className="mt-4 px-8 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign Up
          </Link>
        </p>
         <p className="mt-2 text-center text-xs text-muted-foreground">
          Secure sign-in powered by Firebase
        </p>
      </CardContent>
    </Card>
  );
}
