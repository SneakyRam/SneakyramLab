
import type { User as FirebaseUser } from 'firebase/auth';

export type UserRole = 'user' | 'admin';

export interface User extends FirebaseUser {
  role?: UserRole;
  progress?: UserProgress; // Added to hold progress data
}

export type UserStatus = 'active' | 'deleted' | 'locked';

export interface UserDocument {
    id: string;
    email: string;
    displayName?: string;
    role: UserRole;
    status?: UserStatus;
    createdAt: any; // Firestore ServerTimestamp
    deletedAt?: any;
    lastLoginAt?: any;
    lastLoginIp?: string;
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
  description: string;
  lessons: Lesson[];
}

export interface LearningPath {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  modules: LearningModule[];
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
