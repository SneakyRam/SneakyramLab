'use client';

import { BlogCard } from '@/components/blog/blog-card';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { BlogPost } from '@/lib/types';
import { collection, query, where } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

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

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[225px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}

        {!isLoading &&
          posts?.map(post => (
            <BlogCard
              key={post.id}
              post={{
                ...post,
                // The data from firestore is a seralized object, not a Date object.
                // We need to convert it back to a Date object.
                publishedAt: (post.publishedAt as any).toDate(),
              }}
            />
          ))}
      </div>
    </div>
  );
}
