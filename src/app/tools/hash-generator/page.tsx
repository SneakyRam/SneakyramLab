import { HashGeneratorForm } from "@/components/tools/hash-generator-form";
import HashWidget from "@/components/security/HashWidget";

export default function HashGeneratorPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="mb-12 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
          Hash Generator
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-lg">
          Generate cryptographic hashes from your text using various algorithms.
          <br />
          <span className="font-semibold">Your input is never sent to our servers.</span>
        </p>
      </div>
      <HashWidget />
    </div>
  );
}
