import { ModuleCard } from "@/components/learn/module-card";
import { learningModules } from "@/lib/placeholder-data";
import { GraduationCap } from "lucide-react";

export default function LearnPage() {
  const beginnerModules = learningModules.filter(m => m.difficulty === 'Beginner');
  const intermediateModules = learningModules.filter(m => m.difficulty === 'Intermediate');
  const advancedModules = learningModules.filter(m => m.difficulty === 'Advanced');

  return (
    <div className="bg-background text-foreground">
      <div className="container py-12 md:py-16">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Learning Paths
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-muted-foreground md:text-xl">
            Build real cybersecurity skills — step by step, the right way.
          </p>
        </div>

        {/* Intro Section */}
        <div className="max-w-4xl mx-auto mb-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
                <h3 className="font-headline text-lg font-semibold mb-2">🔹 Structured, Not Random</h3>
                <p className="text-sm text-muted-foreground">Each path is carefully ordered so concepts build on each other.</p>
            </div>
            <div className="flex flex-col items-center">
                <h3 className="font-headline text-lg font-semibold mb-2">🔹 Learn → Practice → Understand</h3>
                <p className="text-sm text-muted-foreground">You don’t just read. You understand why things work.</p>
            </div>
            <div className="flex flex-col items-center">
                <h3 className="font-headline text-lg font-semibold mb-2">🔹 Ethical & Defensive-First</h3>
                <p className="text-sm text-muted-foreground">Everything here focuses on ethical cybersecurity, not misuse.</p>
            </div>
        </div>

        {/* Learning Paths */}
        <div className="space-y-16">
            <div id="beginner">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-green-500" />
                    </div>
                    <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-green-400">Beginner Path</h2>
                </div>
                <div className="grid gap-8 lg:grid-cols-1">
                    {beginnerModules.map((module) => (
                    <ModuleCard key={module.id} module={module} />
                    ))}
                </div>
            </div>

            <div id="intermediate">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-yellow-500" />
                    </div>
                    <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-yellow-400">Intermediate Path</h2>
                </div>
                <div className="grid gap-8 lg:grid-cols-1">
                    {intermediateModules.map((module) => (
                    <ModuleCard key={module.id} module={module} />
                    ))}
                </div>
            </div>

            <div id="advanced">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-red-500" />
                    </div>
                    <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-red-400">Advanced Path</h2>
                </div>
                <div className="grid gap-8 lg:grid-cols-1">
                    {advancedModules.map((module) => (
                    <ModuleCard key={module.id} module={module} />
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
