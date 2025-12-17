import { notFound } from "next/navigation";
import Image from "next/image";
import { blogPosts } from "@/lib/placeholder-data";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export async function generateStaticParams() {
    return blogPosts.map((post) => ({
      slug: post.slug,
    }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article>
        {post.featuredImage && (
            <header className="relative h-[40vh] md:h-[50vh] w-full">
                <Image
                    src={post.featuredImage.src}
                    alt={post.featuredImage.alt}
                    fill
                    className="object-cover"
                    data-ai-hint={post.featuredImage.aiHint}
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            </header>
        )}

        <div className="container relative -mt-16 md:-mt-24 z-10">
            <div className="max-w-3xl mx-auto bg-card p-6 md:p-10 rounded-lg shadow-xl">
                <div className="mb-6">
                    <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Blog
                    </Link>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <Badge variant="outline">{post.category}</Badge>
                        <span>{format(post.publishedAt, "MMMM d, yyyy")}</span>
                        <span>by {post.author}</span>
                    </div>
                </div>

                <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter leading-tight mb-6">
                    {post.title}
                </h1>

                <div className="flex flex-wrap gap-2 mb-8">
                    {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                            #{tag}
                        </Badge>
                    ))}
                </div>

                <div className="prose dark:prose-invert max-w-none text-base md:text-lg">
                    {/* In a real app, this would be rendered from Markdown */}
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    </p>
                    <p>
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida.
                    </p>
                    <h3 className="font-headline">A Deeper Dive</h3>
                    <p>
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                </div>
            </div>
        </div>
        <div className="h-16 md:h-24"></div>
    </article>
  );
}
