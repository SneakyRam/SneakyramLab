import type { User as FirebaseUser } from 'firebase/auth';

export interface User extends FirebaseUser {
  role?: 'admin' | 'user';
  progress?: UserProgress; // Added to hold progress data
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  content: string;
  tags: string[];
  author: string;
  authorId: string;
  publishedAt: Date;
  isPublished: boolean;
  featuredImage?: {
    src: string;
    alt: string;
    aiHint: string;
  };
}

export interface Lesson {
  id: string;
  title: string;
  estimatedTime: string;
  content: string;
}

export interface LearningModule {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  time: string;
  lessons: Lesson[];
  outcomes: string[];
}

export interface Tool {
    id: string;
    title: string;
    description: string;
    href: string;
    icon: React.ElementType;
}

export interface UserProgress {
  userId: string;
  completedLessons: string[]; // array of lesson IDs
  savedBlogPosts: string[]; // array of blog post IDs
  recentTools: string[]; // array of tool IDs
}