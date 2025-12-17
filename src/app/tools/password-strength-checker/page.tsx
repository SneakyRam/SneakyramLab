import { PasswordStrengthForm } from "@/components/tools/password-strength-form";

export default function PasswordStrengthCheckerPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="mb-12 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
          Password Strength Checker
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-lg">
          Analyze how secure your passwords are and get tips to make them stronger.
          <br />
          <span className="font-semibold">We don't store your passwords.</span>
        </p>
      </div>
      <PasswordStrengthForm />
    </div>
  );
}
