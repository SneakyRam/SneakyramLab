
import { ToolCard } from "@/components/tools/tool-card";
import { tools } from "@/lib/placeholder-data";
import AnimatedGradientText from "@/components/effects/animated-gradient-text";

export default function ToolsPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="mb-12 text-center">
        <AnimatedGradientText as="h1" className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
          Cybersecurity Toolkit
        </AnimatedGradientText>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-lg">
          A collection of safe, client-side utilities to help you understand core security concepts. All tools run in your browser.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
