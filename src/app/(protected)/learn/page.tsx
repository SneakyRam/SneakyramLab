
import { PathCard } from "@/components/learn/path-card";
import { learningPaths } from "@/lib/placeholder-data";
import { GraduationCap } from "lucide-react";
import AnimatedGradientText from "@/components/effects/animated-gradient-text";

export default function LearnPage() {
  const beginnerPaths = learningPaths.filter(p => p.level === 'Beginner');
  const intermediatePaths = learningPaths.filter(p => p.level === 'Intermediate');
  const advancedPaths = learningPaths.filter(p => p.level === 'Advanced');

  return (
    <div className="bg-background text-foreground">
      <div className="container py-12 md:py-16">
        {/* Header Section */}
        <div className="mb-12 text-center">
            <AnimatedGradientText as="h1" className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Learning Paths
            </AnimatedGradientText>
          <p className="mt-4 max-w-3xl mx-auto text-muted-foreground md:text-xl">
            Build real cybersecurity skills — step by step, the right way.
          </p>
           <p className="mt-2 max-w-3xl mx-auto text-lg text-muted-foreground">
            Cybersecurity isn’t about memorizing tools. It’s about understanding systems, thinking critically, and acting ethically. These learning paths are designed to take you from zero to a professional mindset, without shortcuts.
          </p>
        </div>

        {/* Intro Section */}
        <div className="max-w-4xl mx-auto mb-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center p-4 rounded-lg transition-colors hover:bg-card/50">
                <h3 className="font-headline text-lg font-semibold mb-2">🔹 Structured, not random</h3>
                <p className="text-sm text-muted-foreground">Every topic is placed deliberately so concepts build on each other — no gaps, no chaos.</p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg transition-colors hover:bg-card/50">
                <h3 className="font-headline text-lg font-semibold mb-2">🔹 Learn → Practice → Understand</h3>
                <p className="text-sm text-muted-foreground">You won’t just read definitions. You’ll understand why things break and how they’re protected.</p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg transition-colors hover:bg-card/50">
                <h3 className="font-headline text-lg font-semibold mb-2">🔹 Ethical & Defensive-First</h3>
                <p className="text-sm text-muted-foreground">Everything here focuses on responsible cybersecurity, not misuse or illegal activity.</p>
            </div>
        </div>

        {/* Learning Paths */}
        <div className="space-y-16">
            {beginnerPaths.length > 0 && (
              <div id="beginner">
                  <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
                          <GraduationCap className="w-6 h-6 text-emerald-400" />
                      </div>
                      <AnimatedGradientText as="h2" className="font-headline text-3xl md:text-4xl font-bold tracking-tight">Beginner</AnimatedGradientText>
                  </div>
                  <div className="grid gap-8 lg:grid-cols-1">
                      {beginnerPaths.map((path) => (
                      <PathCard key={path.id} path={path} />
                      ))}
                  </div>
              </div>
            )}

            {intermediatePaths.length > 0 && (
              <div id="intermediate">
                  <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center border border-yellow-500/20">
                          <GraduationCap className="w-6 h-6 text-yellow-400" />
                      </div>
                      <AnimatedGradientText as="h2" className="font-headline text-3xl md:text-4xl font-bold tracking-tight">Intermediate</AnimatedGradientText>
                  </div>
                  <div className="grid gap-8 lg:grid-cols-1">
                      {intermediatePaths.map((path) => (
                      <PathCard key={path.id} path={path} />
                      ))}
                  </div>
              </div>
            )}

            {advancedPaths.length > 0 && (
              <div id="advanced">
                  <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center border border-red-500/20">
                          <GraduationCap className="w-6 h-6 text-red-400" />
                      </div>
                      <AnimatedGradientText as="h2" className="font-headline text-3xl md:text-4xl font-bold tracking-tight">Advanced</AnimatedGradientText>
                  </div>
                  <div className="grid gap-8 lg:grid-cols-1">
                      {advancedPaths.map((path) => (
                      <PathCard key={path.id} path={path} />
                      ))}
                  </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
    