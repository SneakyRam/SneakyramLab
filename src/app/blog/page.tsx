'use client';

import { BlogCard } from '@/components/blog/blog-card';
import { blogPosts } from "@/lib/placeholder-data";
import type { BlogPost } from '@/lib/types';

export default function BlogPage() {

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-12 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
          The CyberLearn Blog
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-lg">
          Insights, tutorials, and news from the world of cybersecurity.
        </p>
      </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map(post => (
                <BlogCard
                    key={post.id}
                    post={post}
                />
            ))}
        </div>
    </div>
  );
}
