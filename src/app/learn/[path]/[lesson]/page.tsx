import { notFound } from "next/navigation";
import { learningModules } from "@/lib/placeholder-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Clock, BookOpen } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

export async function generateStaticParams() {
  const params: { path: string; lesson: string }[] = [];
  learningModules.forEach((module) => {
    module.lessons.forEach((lesson) => {
      params.push({
        path: module.slug,
        lesson: lesson.id,
      });
    });
  });
  return params;
}

export default function LessonPage({
  params,
}: {
  params: { path: string; lesson: string };
}) {
  const module = learningModules.find((m) => m.slug === params.path);
  const lesson = module?.lessons.find((l) => l.id === params.lesson);

  if (!module || !lesson) {
    notFound();
  }

  const lessonIndex = module.lessons.findIndex((l) => l.id === lesson.id);
  const nextLesson = lessonIndex < module.lessons.length - 1 ? module.lessons[lessonIndex + 1] : null;
  const prevLesson = lessonIndex > 0 ? module.lessons[lessonIndex - 1] : null;

  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
            <Link href="/learn" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Learning Paths
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="w-4 h-4" />
                <span>{module.title}</span>
            </div>
            <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter leading-tight mt-2">
                {lesson.title}
            </h1>
            <div className="flex items-center gap-4 mt-4 text-muted-foreground">
                <Badge variant="outline">{module.difficulty}</Badge>
                <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{lesson.estimatedTime}</span>
                </div>
            </div>
        </div>
        
        <Card className="shadow-lg">
            <CardContent className="p-6 md:p-8">
                <div className="prose dark:prose-invert max-w-none text-base md:text-lg">
                    <ReactMarkdown>{lesson.content}</ReactMarkdown>

                    {/* Placeholder Content */}
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat.</p>
                    <pre><code className="language-js">
{`function helloWorld() {
    console.log("Hello, world!");
}`}
                    </code></pre>
                    <p>Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh.</p>

                </div>
            </CardContent>
        </Card>

        <div className="mt-8 flex justify-between items-center">
            {prevLesson ? (
                <Button variant="outline" asChild>
                    <Link href={`/learn/${module.slug}/${prevLesson.id}`} className="flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Previous
                    </Link>
                </Button>
            ) : (
                <div /> // Placeholder for spacing
            )}
            {nextLesson ? (
                 <Button asChild>
                    <Link href={`/learn/${module.slug}/${nextLesson.id}`} className="flex items-center gap-2">
                        Next Lesson
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </Button>
            ) : (
                <Button asChild>
                    <Link href="/learn">
                        Finish Path
                    </Link>
                </Button>
            )}
        </div>

      </div>
    </div>
  );
}
