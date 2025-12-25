
'use client';

import { BlogCard } from '@/components/blog/blog-card';
import { blogPosts } from "@/lib/placeholder-data";
import AnimatedGradientText from '@/components/effects/animated-gradient-text';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';

export default function BlogPage() {
  // Assume the first post is the featured one
  const featuredPost = blogPosts[0];
  const otherPosts = blogPosts.slice(1);

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-12 text-center">
        <AnimatedGradientText as="h1" className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
          The Blog
        </AnimatedGradientText>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-lg">
          Insights, tutorials, and news from the world of cybersecurity.
        </p>
      </div>

      {/* Featured Post Section */}
      {featuredPost && (
        <section className="mb-16 group">
          <Link href={`/blog/${featuredPost.slug}`}>
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center bg-card/50 border border-border/60 p-6 rounded-lg transition-all duration-300 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10">
              <div className="overflow-hidden rounded-md aspect-video">
                {featuredPost.featuredImage && (
                  <Image
                    src={featuredPost.featuredImage.src}
                    alt={featuredPost.featuredImage.alt}
                    width={1200}
                    height={800}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={featuredPost.featuredImage.aiHint}
                    priority
                  />
                )}
              </div>
              <div className="flex flex-col">
                <div>
                  <Badge variant="outline" className="mb-2">Featured</Badge>
                  <h2 className="font-headline text-3xl lg:text-4xl font-bold tracking-tight text-primary transition-colors group-hover:text-primary/90">
                    {featuredPost.title}
                  </h2>
                  <p className="mt-4 text-muted-foreground line-clamp-3">
                    {featuredPost.content}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
                   <div className="flex items-center gap-2">
                     <span>By {featuredPost.author}</span>
                     <span className="mx-1">•</span>
                     <span>{format(new Date(featuredPost.publishedAt), "MMMM d, yyyy")}</span>
                   </div>
                   <div className="flex items-center font-semibold text-primary group-hover:underline">
                        Read More <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                   </div>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Grid of other posts */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {otherPosts.map(post => (
          <BlogCard
            key={post.id}
            post={post}
          />
        ))}
      </div>
    </div>
  );
}
