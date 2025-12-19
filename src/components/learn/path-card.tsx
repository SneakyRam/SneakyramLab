
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { LearningPath } from "@/lib/types";
import { CheckCircle2, List, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import AnimatedGradientText from "../effects/animated-gradient-text";

interface PathCardProps {
  path: LearningPath;
}

export function PathCard({ path }: PathCardProps) {
  const difficultyStyles = {
    Beginner: "border-emerald-500/30 hover:border-emerald-500/60 hover:shadow-emerald-500/10",
    Intermediate: "border-yellow-500/30 hover:border-yellow-500/60 hover:shadow-yellow-500/10",
    Advanced: "border-red-500/30 hover:border-red-500/60 hover:shadow-red-500/10",
  };

  // Find the very first lesson of the very first module
  const firstLessonId = path.modules[0]?.lessons[0]?.id;

  return (
    <Card className={cn(
        "bg-card/80 backdrop-blur-sm border transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
        difficultyStyles[path.level]
    )}>
        <div className="grid md:grid-cols-[2fr_1fr]">
            <div className="p-6 flex flex-col">
                <CardHeader className="p-0 mb-4">
                    <AnimatedGradientText as="h3" className="font-headline text-2xl mb-4">{path.title}</AnimatedGradientText>
                    <CardDescription>{path.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-0 flex-1 space-y-4">
                    <div>
                        <h4 className="font-semibold text-sm mb-2 flex items-center"><List className="w-4 h-4 mr-2 text-primary"/>Modules</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            {path.modules.map(m => <span key={m.id}>• {m.title}</span>)}
                        </div>
                    </div>
                </CardContent>
            </div>
            <div className="p-6 bg-card/60 md:rounded-r-lg flex flex-col justify-between">
                <div>
                     <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <span className="font-bold">{path.level}</span>
                        <span className="mx-1">•</span>
                        <span>{path.estimatedWeeks} weeks</span>
                    </div>
                </div>
                <Button asChild className="w-full" disabled={!firstLessonId}>
                    <Link href={`/learn/${path.slug}/${firstLessonId}`}>Start Path</Link>
                </Button>
            </div>
        </div>
    </Card>
  );
}

    