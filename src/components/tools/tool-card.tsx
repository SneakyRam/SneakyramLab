import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Tool } from "@/lib/types";

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const Icon = tool.icon;
  return (
    <Link href={tool.href} className="group block h-full">
        <Card className="h-full transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium font-headline">{tool.title}</CardTitle>
            <Icon className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary" />
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">
            {tool.description}
            </p>
        </CardContent>
        </Card>
    </Link>
  );
}
