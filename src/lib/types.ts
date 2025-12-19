
import type { User as FirebaseUser } from 'firebase/auth';

export type UserRole = 'user' | 'admin';

export interface User extends FirebaseUser {
  role?: UserRole;
  progress?: UserProgress;
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

export type LessonType = "theory" | "demo" | "practice" | "quiz";

export interface Lesson {
  id: string;
  title: string;
  content: string;
  type: LessonType;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: number; // in minutes
  order?: number;
  resources?: { label: string; url: string }[];
  isPublished?: boolean;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  order: number;
  isPublished: boolean;
  lessons: Lesson[];
}

export interface LearningPath {
  id: string;
  slug: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  order: number;
  isPublished: boolean;
  estimatedWeeks: number;
  modules: LearningModule[];
}


export interface Tool {
    id: string;
    title: string;
    description: string;
    href: string;
    icon: React.ElementType;
}

export interface UserProgress {
  currentPath?: string;
  completedLessons: string[];
  completedModules?: string[];
  lastLesson?: string;
  updatedAt?: any; // Firestore ServerTimestamp
}

    