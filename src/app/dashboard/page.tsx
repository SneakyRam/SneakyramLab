"use client";

import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Newspaper, Wrench, User as UserIcon } from "lucide-react";

export default function DashboardPage() {
    const { user } = useAuth();

    if (!user) return null;

    const userInitial = user.email ? user.email.charAt(0).toUpperCase() : <UserIcon className="h-8 w-8" />;

    return (
        <div className="container py-8 md:py-12">
            <div className="mb-8">
                <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
                    Welcome back, {user.displayName || 'Learner'}!
                </h1>
                <p className="text-muted-foreground mt-2">Here's a snapshot of your journey with us.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                {/* Left Column - Profile & Progress */}
                <div className="md:col-span-1 space-y-8">
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
                                <BookOpen className="h-5 w-5 text-primary" />
                                Learning Progress
                            </CardTitle>
                            <CardDescription>You've completed 3 out of 10 lessons.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Progress value={30} className="w-full" />
                            <p className="mt-2 text-sm text-muted-foreground text-right">30% complete</p>
                        </CardContent>
                    </Card>
                </div>
                
                {/* Right Column - Saved Items & Recent Activity */}
                <div className="md:col-span-2 space-y-8">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-headline text-xl">
                                <Newspaper className="h-5 w-5 text-primary" />
                                Saved Blog Posts
                            </CardTitle>
                            <CardDescription>Your reading list for later.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                <li className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">Understanding the Basics of Cybersecurity</li>
                                <li className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">Setting Up a Secure Home Network</li>
                                <li className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">Advanced SQL Injection Techniques</li>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-headline text-xl">
                                <Wrench className="h-5 w-5 text-primary" />
                                Recently Used Tools
                            </CardTitle>
                            <CardDescription>Jump back into your favorite utilities.</CardDescription>
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
