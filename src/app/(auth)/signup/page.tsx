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

export default function SignupPage() {
  return (
    <Card className="mx-auto w-full max-w-sm border-border/60 shadow-lg shadow-black/20">
      <CardHeader className="text-center">
        <div className="mb-4 flex justify-center">
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
        <AuthForm mode="signup" />
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
