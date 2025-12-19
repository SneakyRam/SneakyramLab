
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Clock, BookOpen } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { getAdminDb } from "@/lib/firebase-admin";
import type { LearningPath, Lesson } from "@/lib/types";

export const dynamic = 'force-dynamic';

// Fetch lesson data from Firestore on the server
async function getLessonData(pathSlug: string, lessonId: string) {
    const db = getAdminDb();
    const pathsRef = db.collection('paths');
    const pathSnapshot = await pathsRef.where('slug', '==', pathSlug).limit(1).get();

    if (pathSnapshot.empty) {
        return { path: null, lesson: null, prevLesson: null, nextLesson: null };
    }

    const pathDoc = pathSnapshot.docs[0];
    const path = { id: pathDoc.id, ...pathDoc.data() } as LearningPath;
    
    // The lessons are nested within modules, so we need to flatten them.
    const allLessons = path.modules?.flatMap(m => m.lessons) || [];
    const lesson = allLessons.find((l) => l.id === lessonId);
    
    if (!lesson) {
        return { path, lesson: null, prevLesson: null, nextLesson: null };
    }

    const lessonIndex = allLessons.findIndex((l) => l.id === lessonId);
    const nextLesson = lessonIndex < allLessons.length - 1 ? allLessons[lessonIndex + 1] : null;
    const prevLesson = lessonIndex > 0 ? allLessons[lessonIndex - 1] : null;

    return { path, lesson, prevLesson, nextLesson };
}


export default async function LessonPage({
  params,
}: {
  params: { path: string; lesson: string };
}) {
  const { path, lesson, prevLesson, nextLesson } = await getLessonData(params.path, params.lesson);

  if (!path || !lesson) {
    notFound();
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4 pl-0">
                <Link href="/learn" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Learning Paths
                </Link>
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="w-4 h-4" />
                <span>{path.title}</span>
            </div>
            <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter leading-tight mt-2">
                {lesson.title}
            </h1>
            <div className="flex items-center gap-4 mt-4 text-muted-foreground">
                <Badge variant="outline">{path.level}</Badge>
                <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{lesson.estimatedTime} min</span>
                </div>
            </div>
        </div>
        
        <Card className="shadow-lg">
            <CardContent className="p-6 md:p-8">
                <div className="prose dark:prose-invert max-w-none text-base md:text-lg">
                    <ReactMarkdown>{lesson.content}</ReactMarkdown>
                </div>
            </CardContent>
        </Card>

        <div className="mt-8 flex justify-between items-center">
            {prevLesson ? (
                <Button variant="outline" asChild>
                    <Link href={`/learn/${path.slug}/${prevLesson.id}`} className="flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Previous
                    </Link>
                </Button>
            ) : (
                <div /> // Placeholder for spacing
            )}
            {nextLesson ? (
                 <Button asChild>
                    <Link href={`/learn/${path.slug}/${nextLesson.id}`} className="flex items-center gap-2">
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
