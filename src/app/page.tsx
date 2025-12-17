import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Wrench, ShieldCheck, Bot } from "lucide-react";
import { BlogCard } from "@/components/blog/blog-card";
import { blogPosts, learningModules, tools } from "@/lib/placeholder-data";
import ConnectingDotsCanvas from "@/components/effects/connecting-dots-canvas";

const features = [
  {
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    title: "Learn",
    description: "Follow structured paths to build real skills from the ground up.",
  },
  {
    icon: <Wrench className="h-8 w-8 text-primary" />,
    title: "Practice",
    description: "Use safe, client-side tools to understand security concepts.",
  },
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: "Understand",
    description: "Get guidance from a context-aware, educational AI tutor.",
  },
];

export default function Home() {
  const featuredPosts = blogPosts.slice(0, 3);
  const featuredPaths = learningModules.slice(0,3);
  const featuredTools = tools.slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[70vh] flex-col items-center justify-center text-center overflow-hidden">
        <ConnectingDotsCanvas />
        <div className="container relative z-10 max-w-4xl px-4">
          <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Learn cybersecurity the calm, ethical, and correct way.
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground md:text-xl">
            Built by a learner, for learners. No hype, no shortcuts, just real understanding.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/learn">Start Learning</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/tools">Explore Tools</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="text-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10">
                <CardHeader>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-card">
                    {feature.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="mb-2 font-headline text-xl">{feature.title}</CardTitle>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Paths Preview */}
      <section className="py-16 md:py-24 bg-card/50">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Learning Paths</h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-lg">Structured modules to guide you from zero to confident.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {featuredPaths.map((path) => (
              <Card key={path.id} className="flex flex-col transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent/10">
                  <CardHeader>
                      <CardTitle className="font-headline">{path.title}</CardTitle>
                      <CardDescription>{path.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                      <p className="text-sm text-muted-foreground">For {path.difficulty} learners. Est. time: {path.time}</p>
                  </CardContent>
                  <CardFooter>
                      <Button variant="outline" asChild className="w-full">
                          <Link href={`/learn/${path.slug}/${path.lessons[0].id}`}>Start Path</Link>
                      </Button>
                  </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Preview */}
      <section className="py-16 md:py-24">
        <div className="container">
           <div className="mb-12 text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Practical Tools</h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-lg">Safe, client-side utilities to help you understand core concepts.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredTools.map((tool) => {
                const Icon = tool.icon;
                return (
                    <Link href={tool.href} key={tool.id} className="group block h-full">
                        <Card className="h-full p-4 text-center transition-all duration-300 hover:bg-card/80 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-card">
                            <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="mt-4 font-headline text-lg">{tool.title}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">Runs locally in your browser</p>
                        </Card>
                    </Link>
                )
            })}
          </div>
        </div>
      </section>

       {/* CTA Section */}
       <section className="py-16 md:py-24 bg-card/50">
        <div className="container text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Start Learning?</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-lg">
            Create an account to track your progress, save articles, and access exclusive content.
          </p>
          <div className="mt-8">
            <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/signup">Join for Free</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
