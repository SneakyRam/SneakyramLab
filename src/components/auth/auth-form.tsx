"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface AuthFormProps {
  mode: "login" | "signup";
}

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

type UserFormValue = z.infer<typeof formSchema>;

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
        <path d="M1 1h22v22H1z" fill="none"></path>
    </svg>
);


export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleAuthSuccess = () => {
    const from = searchParams.get("from") || "/dashboard";
    router.replace(from);
  };

  const handleAuthError = (error: any) => {
    toast({
      variant: "destructive",
      title: "Authentication failed",
      description: error.message || "An unexpected error occurred. Please try again.",
    });
  };

  const onSubmit = async (data: UserFormValue) => {
    setIsLoading(true);
    try {
      if (mode === "signup") {
        await createUserWithEmailAndPassword(auth, data.email, data.password);
      } else {
        await signInWithEmailAndPassword(auth, data.email, data.password);
      }
      handleAuthSuccess();
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const googleSignIn = async () => {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      handleAuthSuccess();
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className={cn("grid gap-6")}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    disabled={isLoading || isGoogleLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    disabled={isLoading || isGoogleLoading} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isLoading || isGoogleLoading} className="w-full" type="submit">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'login' ? 'Sign In' : 'Create account'}
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading || isGoogleLoading}
        onClick={googleSignIn}
      >
        {isGoogleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <GoogleIcon />
        )}
        Google
      </Button>
    </div>
  );
}
