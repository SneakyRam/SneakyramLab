import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/types";
import { ArrowRight } from "lucide-react";
import { format } from "date-fns";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  // Firestore timestamps need to be converted to Date objects, but placeholder data is already a Date object
  const publishedDate = post.publishedAt instanceof Date 
    ? post.publishedAt
    : (post.publishedAt as any).toDate();

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10">
      <CardHeader className="p-0">
        <Link href={`/blog/${post.slug}`} className="block">
          <div className="aspect-video overflow-hidden">
            {post.featuredImage ? (
              <Image
                src={post.featuredImage.src}
                alt={post.featuredImage.alt}
                width={600}
                height={400}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={post.featuredImage.aiHint}
              />
            ) : (
                <div className="h-full w-full bg-secondary"></div>
            )}
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-4">
        <div className="flex-1">
            <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
                <Badge variant="outline">{post.category}</Badge>
                <Badge variant={
                    post.difficulty === 'Beginner' ? 'secondary' :
                    post.difficulty === 'Intermediate' ? 'default' : 'destructive'
                }>{post.difficulty}</Badge>
            </div>
            <CardTitle className="mb-2 text-xl font-headline">
                <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                    {post.title}
                </Link>
            </CardTitle>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          By {post.author} on {format(publishedDate, "MMM d, yyyy")}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/blog/${post.slug}`} className="flex items-center text-sm font-semibold text-primary hover:underline">
          Read More <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
