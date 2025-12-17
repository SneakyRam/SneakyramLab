import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { LearningModule } from "@/lib/types";
import { ArrowRight } from "lucide-react";

interface ModuleCardProps {
  module: LearningModule;
}

export function ModuleCard({ module }: ModuleCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
            <CardTitle className="font-headline text-xl">
                <Link href={`/learn/${module.slug}`} className="hover:text-primary transition-colors">
                    {module.title}
                </Link>
            </CardTitle>
            <Badge variant={
                module.difficulty === 'Beginner' ? 'secondary' :
                module.difficulty === 'Intermediate' ? 'default' : 'destructive'
            }>{module.difficulty}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <CardDescription>{module.description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Link href={`/learn/${module.slug}`} className="flex items-center text-sm font-semibold text-primary hover:underline">
          Start Learning <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
