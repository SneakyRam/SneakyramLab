
import { notFound } from "next/navigation";
import Image from "next/image";
import { blogPosts } from "@/lib/placeholder-data";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import AnimatedGradientText from "@/components/effects/animated-gradient-text";

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
        <header className="relative py-24 md:py-32 overflow-hidden">
            <div className="absolute inset-0 -z-10 h-full w-full bg-[#0B0F14] [background-image:radial-gradient(circle_at_20%_20%,_rgba(255,255,255,0.03),_transparent_30%),radial-gradient(circle_at_80%_70%,_rgba(255,255,255,0.04),_transparent_30%)]" />
            <div className="container relative z-10 text-center">
                 <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Blog
                </Link>
                <AnimatedGradientText as="h1" className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight max-w-4xl mx-auto">
                    {post.title}
                </AnimatedGradientText>
                <div className="mt-6 flex justify-center items-center gap-4 text-sm text-muted-foreground">
                    <span>By {post.author}</span>
                    <span className="mx-1">•</span>
                    <span>Published on {format(post.publishedAt, "MMMM d, yyyy")}</span>
                     <span className="mx-1">•</span>
                    <span>{post.category}</span>
                </div>
            </div>
        </header>

        <div className="container py-8 md:py-12">
            <div className="mx-auto max-w-4xl">
                 <div className="prose dark:prose-invert max-w-none text-base md:text-lg prose-headings:font-headline prose-headings:tracking-tighter prose-blockquote:border-primary prose-blockquote:bg-primary/10 prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:rounded-r-lg prose-a:text-primary hover:prose-a:underline">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>
                <hr className="my-8" />
                <div className="text-center p-6 bg-secondary/30 rounded-lg not-prose">
                    <h3 className="font-headline text-xl mb-2">Advance Your Understanding</h3>
                    <p>Ready to deepen your expertise? Explore our structured <Link href="/learn" className="text-primary hover:underline font-semibold">Learning Paths</Link> to build practical skills, step by step.</p>
                </div>
            </div>
        </div>
    </article>
  );
}
