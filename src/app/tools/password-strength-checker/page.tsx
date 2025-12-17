import SecurityTutor from "@/components/security/SecurityTutor";

export default function PasswordCheckerPage() {
  return (
    <main className="container py-8 md:py-12">
       <div className="mb-12 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
          Password Strength Checker
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-lg">
          Analyze how secure your passwords are using real entropy calculations.
          <br />
          <span className="font-semibold">Your input is never sent to our servers.</span>
        </p>
      </div>
      <SecurityTutor />
    </main>
  );
}
