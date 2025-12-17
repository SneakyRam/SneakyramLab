import type { BlogPost, LearningModule, Tool } from '@/lib/types';
import { ShieldCheck, Lock, Hash, KeyRound, FileText } from 'lucide-react';

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Understanding the Basics of Cybersecurity',
    slug: 'understanding-basics-of-cybersecurity',
    category: 'Cybersecurity Fundamentals',
    difficulty: 'Beginner',
    content: 'This is the full markdown content for the blog post. It covers the fundamental concepts of cybersecurity...',
    tags: ['cybersecurity', 'beginner', 'introduction'],
    author: 'Admin User',
    authorId: 'admin1',
    publishedAt: new Date('2023-10-01'),
    isPublished: true,
    featuredImage: {
        src: 'https://picsum.photos/seed/101/1200/800',
        alt: 'Abstract cybersecurity concept with digital locks.',
        aiHint: 'cybersecurity lock'
    }
  },
  {
    id: '2',
    title: 'Advanced SQL Injection Techniques',
    slug: 'advanced-sql-injection-techniques',
    category: 'Web Security',
    difficulty: 'Advanced',
    content: 'This post delves deep into advanced SQL injection techniques, how to perform them, and how to prevent them...',
    tags: ['sql', 'web security', 'hacking'],
    author: 'Admin User',
    authorId: 'admin1',
    publishedAt: new Date('2023-10-15'),
    isPublished: true,
    featuredImage: {
        src: 'https://picsum.photos/seed/102/1200/800',
        alt: 'Developer coding on a laptop.',
        aiHint: 'developer code'
    }
  },
  {
    id: '3',
    title: 'Setting Up a Secure Home Network',
    slug: 'setting-up-secure-home-network',
    category: 'Network Security',
    difficulty: 'Intermediate',
    content: 'Learn step-by-step how to secure your home network from common threats. This guide is for intermediate users...',
    tags: ['network', 'security', 'home lab'],
    author: 'Admin User',
    authorId: 'admin1',
    publishedAt: new Date('2023-11-01'),
    isPublished: true,
    featuredImage: {
        src: 'https://picsum.photos/seed/103/1200/800',
        alt: 'Network servers in a data center.',
        aiHint: 'data center'
    }
  },
];

export const learningModules: LearningModule[] = [
  {
    id: '1',
    title: 'Introduction to Ethical Hacking',
    slug: 'intro-to-ethical-hacking',
    description: 'Learn the fundamentals of ethical hacking and penetration testing.',
    difficulty: 'Beginner',
    lessons: [
        { id: '1-1', title: 'What is Ethical Hacking?', slug: 'what-is-ethical-hacking', content: '...', relatedPosts: [] },
        { id: '1-2', title: 'Reconnaissance', slug: 'reconnaissance', content: '...', relatedPosts: [] },
    ]
  },
  {
    id: '2',
    title: 'Web Application Security',
    slug: 'web-application-security',
    description: 'Master the art of securing web applications from common vulnerabilities.',
    difficulty: 'Intermediate',
    lessons: [
        { id: '2-1', title: 'Understanding the OWASP Top 10', slug: 'owasp-top-10', content: '...', relatedPosts: [] },
        { id: '2-2', title: 'Cross-Site Scripting (XSS)', slug: 'cross-site-scripting', content: '...', relatedPosts: [] },
    ]
  },
  {
    id: '3',
    title: 'Advanced Network Defense',
    slug: 'advanced-network-defense',
    description: 'Explore advanced techniques for defending corporate networks.',
    difficulty: 'Advanced',
    lessons: [
        { id: '3-1', title: 'Intrusion Detection Systems', slug: 'intrusion-detection-systems', content: '...', relatedPosts: [] },
        { id: '3-2', title: 'Firewall Configuration', slug: 'firewall-configuration', content: '...', relatedPosts: [] },
    ]
  },
];

export const tools: Tool[] = [
    {
        id: '1',
        title: 'Password Strength Checker',
        description: 'Analyze password strength and get AI-powered improvement tips.',
        href: '/tools/password-strength-checker',
        icon: ShieldCheck,
    },
    {
        id: '3',
        title: 'Hash Generator',
        description: 'Generate hashes for your data using SHA-256, MD5, and more.',
        href: '/tools/hash-generator',
        icon: Hash,
    },
    {
        id: '2',
        title: 'Text Encoder/Decoder',
        description: 'Encode and decode text using various formats like Base64.',
        href: '/tools/encoder-decoder',
        icon: KeyRound,
    },
    {
        id: '4',
        title: 'PDF to DOC Converter',
        description: 'Quickly convert your PDF files into editable Word documents.',
        href: '/tools/pdf-to-doc',
        icon: FileText,
    }
];
