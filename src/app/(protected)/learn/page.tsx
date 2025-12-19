
'use client';

import { PathCard } from "@/components/learn/path-card";
import { GraduationCap } from "lucide-react";
import AnimatedGradientText from "@/components/effects/animated-gradient-text";
import { collection } from "firebase/firestore";
import { useFirebase } from "@/firebase/provider";
import { useCollection } from "@/firebase/firestore/use-collection";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { LearningPath } from "@/lib/types";

export default function LearnPage() {
  const { firestore } = useFirebase();
  const pathsQuery = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, "paths");
  }, [firestore]);

  const { data: paths, isLoading } = useCollection<LearningPath>(pathsQuery);

  const beginnerPaths = useMemo(() => paths?.filter((p) => p.level === "Beginner") || [], [paths]);
  const intermediatePaths = useMemo(() => paths?.filter((p) => p.level === "Intermediate") || [], [paths]);
  const advancedPaths = useMemo(() => paths?.filter((p) => p.level === "Advanced") || [], [paths]);

  const PathList = ({ paths, isLoading }: { paths: LearningPath[], isLoading: boolean }) => {
    if (isLoading) {
      return (
        <div className="grid gap-8 lg:grid-cols-1">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      )
    }
    return (
      <div className="grid gap-8 lg:grid-cols-1">
        {paths.map((path) => (
          <PathCard key={path.id} path={path} />
        ))}
      </div>
    );
  }


  return (
    <div className="bg-background text-foreground">
      <div className="container py-12 md:py-16">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <AnimatedGradientText
            as="h1"
            className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl"
          >
            Learning Paths
          </AnimatedGradientText>
          <p className="mt-4 max-w-3xl mx-auto text-muted-foreground md:text-xl">
            Build real cybersecurity skills — step by step, the right way.
          </p>
        </div>

        {/* Learning Paths */}
        <div className="space-y-16">
          {(isLoading || beginnerPaths.length > 0) && (
            <div id="beginner">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
                  <GraduationCap className="w-6 h-6 text-emerald-400" />
                </div>
                <AnimatedGradientText
                  as="h2"
                  className="font-headline text-3xl md:text-4xl font-bold tracking-tight"
                >
                  Beginner
                </AnimatedGradientText>
              </div>
              <PathList paths={beginnerPaths} isLoading={isLoading} />
            </div>
          )}

          {(isLoading || intermediatePaths.length > 0) && (
            <div id="intermediate">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center border border-yellow-500/20">
                  <GraduationCap className="w-6 h-6 text-yellow-400" />
                </div>
                <AnimatedGradientText
                  as="h2"
                  className="font-headline text-3xl md:text-4xl font-bold tracking-tight"
                >
                  Intermediate
                </AnimatedGradientText>
              </div>
              <PathList paths={intermediatePaths} isLoading={isLoading} />
            </div>
          )}

          {(isLoading || advancedPaths.length > 0) && (
            <div id="advanced">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center border border-red-500/20">
                  <GraduationCap className="w-6 h-6 text-red-400" />
                </div>
                <AnimatedGradientText
                  as="h2"
                  className="font-headline text-3xl md:text-4xl font-bold tracking-tight"
                >
                  Advanced
                </AnimatedGradientText>
              </div>
              <PathList paths={advancedPaths} isLoading={isLoading} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
