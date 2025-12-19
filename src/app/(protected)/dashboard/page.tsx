
"use client";

import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Newspaper, Wrench, User as UserIcon } from "lucide-react";
import { learningPaths } from "@/lib/placeholder-data";
import Link from "next/link";

export default function DashboardPage() {
    const { user } = useAuth();

    // Mock progress data for now
    const completedLessonsCount = 5;
    const totalLessonsCount = learningPaths.flatMap(p => p.modules.flatMap(m => m.lessons)).length;
    const progressPercentage = (completedLessonsCount / totalLessonsCount) * 100;
    
    // Mock recent activity
    const recentLesson = learningPaths[0].modules[0].lessons[1];

    if (!user) return null;

    const userInitial = user.email ? user.email.charAt(0).toUpperCase() : <UserIcon className="h-8 w-8" />;

    return (
        <div className="container py-8 md:py-12">
            <div className="mb-8">
                <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
                    Welcome back, {user.displayName || 'Learner'}!
                </h1>
                <p className="text-muted-foreground mt-2">Here's a snapshot of your learning journey.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Main Column */}
                <div className="lg:col-span-2 space-y-8">
                     <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-headline text-xl">
                                <BookOpen className="h-5 w-5 text-primary" />
                                Learning Progress
                            </CardTitle>
                            <CardDescription>You've completed {completedLessonsCount} out of {totalLessonsCount} available lessons.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Progress value={progressPercentage} className="w-full" />
                            <p className="mt-2 text-sm text-muted-foreground text-right">{Math.round(progressPercentage)}% complete</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-headline text-xl">
                                <BookOpen className="h-5 w-5 text-primary" />
                                Continue Learning
                            </CardTitle>
                            <CardDescription>Pick up where you left off.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <ul className="space-y-2">
                                    <li key={recentLesson.id}>
                                        <Link href={`/learn/${learningPaths[0].slug}/${recentLesson.id}`} className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                                            {recentLesson.title}
                                        </Link>
                                    </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
                
                {/* Side Column */}
                <div className="lg:col-span-1 space-y-8">
                    <Card className="shadow-lg">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={user.photoURL || ''} />
                                <AvatarFallback className="text-2xl">{userInitial}</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-xl font-headline">{user.displayName || 'Anonymous User'}</CardTitle>
                                <CardDescription>{user.email}</CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                     <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-headline text-xl">
                                <Newspaper className="h-5 w-5 text-primary" />
                                Saved Blog Posts
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                             <p className="text-sm text-muted-foreground">You haven't saved any posts yet.</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-headline text-xl">
                                <Wrench className="h-5 w-5 text-primary" />
                                Recently Used Tools
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <ul className="space-y-2">
                                <li className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">Password Strength Checker</li>
                                <li className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">Hash Generator</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
