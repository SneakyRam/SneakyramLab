import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { LearningModule } from "@/lib/types";
import { CheckCircle2, Clock, List, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModuleCardProps {
  module: LearningModule;
}

export function ModuleCard({ module }: ModuleCardProps) {
  const difficultyStyles = {
    Beginner: "border-green-500/50 hover:border-green-500/80 hover:shadow-green-500/10",
    Intermediate: "border-yellow-500/50 hover:border-yellow-500/80 hover:shadow-yellow-500/10",
    Advanced: "border-red-500/50 hover:border-red-500/80 hover:shadow-red-500/10",
  };

  return (
    <Card className={cn(
        "bg-card/50 backdrop-blur-sm border-2 border-transparent transition-all duration-300 hover:shadow-lg",
        difficultyStyles[module.difficulty]
    )}>
        <div className="grid md:grid-cols-[2fr_1fr]">
            <div className="p-6 flex flex-col">
                <CardHeader className="p-0 mb-4">
                    <CardTitle className="font-headline text-2xl mb-2">{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-0 flex-1 space-y-4">
                    <div>
                        <h4 className="font-semibold text-sm mb-2 flex items-center"><List className="w-4 h-4 mr-2 text-primary"/>Modules</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            {module.modules.map(m => <span key={m}>• {m}</span>)}
                        </div>
                    </div>
                     <div>
                        <h4 className="font-semibold text-sm mb-2 mt-4 flex items-center"><Target className="w-4 h-4 mr-2 text-primary"/>By the end, you will be able to</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                           {module.outcomes.map(o => (
                               <li key={o} className="flex items-start">
                                   <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                                   <span>{o}</span>
                                </li>
                           ))}
                        </ul>
                    </div>
                </CardContent>
            </div>
            <div className="p-6 bg-muted/30 md:rounded-r-lg flex flex-col justify-between">
                <div>
                     <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Clock className="w-4 h-4"/>
                        <span>Est. time: <strong>{module.time}</strong></span>
                    </div>
                </div>
                <Button asChild className="w-full">
                    <Link href={`/learn/${module.slug}`}>Start Path</Link>
                </Button>
            </div>
        </div>
    </Card>
  );
}
