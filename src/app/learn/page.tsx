import { ModuleCard } from "@/components/learn/module-card";
import { learningModules } from "@/lib/placeholder-data";

export default function LearnPage() {
  const beginnerModules = learningModules.filter(m => m.difficulty === 'Beginner');
  const intermediateModules = learningModules.filter(m => m.difficulty === 'Intermediate');
  const advancedModules = learningModules.filter(m => m.difficulty === 'Advanced');

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-12 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
          Learning Paths
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-lg">
          Follow our structured paths to build your cybersecurity expertise from scratch.
        </p>
      </div>

      <div className="space-y-12">
        <div>
          <h2 className="font-headline text-2xl md:text-3xl font-bold tracking-tight mb-6 border-l-4 border-primary pl-4">Beginner</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {beginnerModules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        </div>

        <div>
            <h2 className="font-headline text-2xl md:text-3xl font-bold tracking-tight mb-6 border-l-4 border-primary pl-4">Intermediate</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {intermediateModules.map((module) => (
                <ModuleCard key={module.id} module={module} />
                ))}
            </div>
        </div>

        <div>
            <h2 className="font-headline text-2xl md:text-3xl font-bold tracking-tight mb-6 border-l-4 border-primary pl-4">Advanced</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {advancedModules.map((module) => (
                <ModuleCard key={module.id} module={module} />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
