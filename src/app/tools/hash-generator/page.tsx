
import HashGenerator from "@/components/tools/HashGenerator";
import AnimatedGradientText from "@/components/effects/animated-gradient-text";

export default function HashGeneratorPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="mb-12 text-center">
        <AnimatedGradientText as="h1" className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
          Hash Generator
        </AnimatedGradientText>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-lg">
          Generate cryptographic hashes from your text and visualize the avalanche effect.
          <br />
          <span className="font-semibold">Your input is processed in your browser and never sent to our servers.</span>
        </p>
      </div>
      <HashGenerator />
    </div>
  );
}
