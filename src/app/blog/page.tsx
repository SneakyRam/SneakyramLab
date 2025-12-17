'use client';

import { BlogCard } from '@/components/blog/blog-card';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { BlogPost } from '@/lib/types';
import { collection, query, where } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { addBlogPosts } from '@/lib/seed';

export default function BlogPage() {
  const firestore = useFirestore();

  const blogPostsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'blog_posts'),
      where('isPublished', '==', true)
    );
  }, [firestore]);

  const { data: posts, isLoading } = useCollection<BlogPost>(blogPostsQuery);

  const handleSeed = async () => {
    if (firestore) {
        await addBlogPosts(firestore);
        // This won't auto-refresh the useCollection hook, a page reload would be needed
        // For a better UX, we could trigger a re-fetch, but for this purpose, it's okay.
        alert('Blog posts have been added to Firestore. Please refresh the page.');
    }
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-8 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
          The CyberLearn Blog
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-lg">
          Insights, tutorials, and news from the world of cybersecurity.
        </p>
      </div>

      {isLoading && (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[225px] w-full rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
                </div>
            ))}
        </div>
      )}

      {!isLoading && posts && posts.length > 0 && (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts?.map(post => (
                <BlogCard
                key={post.id}
                post={{
                    ...post,
                    publishedAt: (post.publishedAt as any).toDate(),
                }}
                />
            ))}
        </div>
      )}

      {!isLoading && (!posts || posts.length === 0) && (
        <div className="text-center py-16">
            <h2 className="text-2xl font-headline font-semibold">No Blog Posts Yet</h2>
            <p className="mt-2 text-muted-foreground">It looks like there are no posts in the database.</p>
            <Button onClick={handleSeed} className="mt-4">
                Seed Initial Posts
            </Button>
        </div>
      )}
    </div>
  );
}
