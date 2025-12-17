import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Wrench, ShieldCheck } from "lucide-react";
import { BlogCard } from "@/components/blog/blog-card";
import { blogPosts } from "@/lib/placeholder-data";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const features = [
  {
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    title: "Structured Learning Paths",
    description: "Follow curated learning modules to build your cybersecurity skills from the ground up.",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: "In-Depth Blog Posts",
    description: "Stay updated with the latest trends, threats, and technologies in the cyber world.",
  },
  {
    icon: <Wrench className="h-8 w-8 text-primary" />,
    title: "Practical Mini-Tools",
    description: "Use our suite of tools for password strength checking, hashing, and more.",
  },
];

const heroImage = PlaceHolderImages.find(img => img.id === 'homepage-hero');

export default function Home() {
  const featuredPosts = blogPosts.slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white">
        {heroImage && (
            <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
            />
        )}
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 max-w-4xl px-4">
          <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Unlock the World of Cybersecurity
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-primary-foreground/80 md:text-xl">
            Your central hub for structured learning, in-depth articles, and practical tools to master the art of digital defense.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/signup">Get Started for Free</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/blog">Explore Content</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Everything You Need to Succeed</h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-lg">
              A comprehensive platform designed for learners at all levels.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
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

      {/* Featured Blog Posts Section */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container">
          <div className="flex flex-col items-center text-center">
             <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
               Latest from the Blog
             </h2>
             <p className="mt-4 max-w-2xl text-muted-foreground md:text-lg">
               Dive into our latest articles and stay ahead of the curve.
             </p>
           </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild variant="outline">
              <Link href="/blog">
                View All Posts <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

       {/* CTA Section */}
       <section className="py-16 md:py-24 bg-background">
        <div className="container text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Start Learning?</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-lg">
            Create an account to track your progress, save articles, and access exclusive content.
          </p>
          <div className="mt-8">
            <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/signup">Join CyberLearn Central Today</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
