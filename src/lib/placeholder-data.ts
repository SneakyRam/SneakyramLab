import type { BlogPost, LearningModule, Tool } from '@/lib/types';
import { ShieldCheck, Lock, Hash, KeyRound, Files } from 'lucide-react';

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
    title: 'Foundations of Cybersecurity & Ethical Hacking',
    slug: 'foundations-of-cybersecurity',
    description: 'Perfect if you’re starting from zero or want strong fundamentals. Learn how hacking works (ethically) and how defenders think.',
    difficulty: 'Beginner',
    time: '2-3 weeks',
    outcomes: [
        'Explain cybersecurity clearly',
        'Understand vulnerabilities conceptually',
        'Avoid common beginner mistakes'
    ],
    modules: [
        'What is Cybersecurity & Ethical Hacking',
        'How the Internet Works (DNS, HTTP, TCP/IP)',
        'Linux & Command Line Basics',
        'Passwords, Hashing & Authentication',
        'Common Attack Types (Brute Force, Phishing, Malware)',
        'Security Mindset & Ethics'
    ]
  },
  {
    id: '2',
    title: 'Web Application Security & Bug Hunting',
    slug: 'web-application-security',
    description: 'For learners who know the basics and want real-world relevance. Discover where vulnerabilities hide in modern web apps.',
    difficulty: 'Intermediate',
    time: '4-6 weeks',
    outcomes: [
        'Identify common web vulnerabilities',
        'Understand professional security reports',
        'Think like an ethical security tester'
    ],
    modules: [
        'How Web Applications Work (Frontend, Backend, APIs)',
        'Authentication & Session Security',
        'OWASP Top 10 (SQLi, XSS, CSRF, IDOR, etc.)',
        'Secure Password Storage & Hashing',
        'Input Validation & Data Sanitization',
        'Basic Bug Bounty Mindset'
    ]
  },
  {
    id: '3',
    title: 'Advanced Network Defense & Blue Teaming',
    slug: 'advanced-network-defense',
    description: 'For learners who want deep technical and defensive skills. Learn how organizations protect their critical infrastructure.',
    difficulty: 'Advanced',
    time: '6-8 weeks',
    outcomes: [
        'Understand enterprise security architecture',
        'Explain modern defensive strategies',
        'Think like a blue-team engineer'
    ],
    modules: [
        'Network Architecture & Threat Models',
        'Firewalls, IDS/IPS, and SIEM Basics',
        'Secure Network Design Principles',
        'Log Analysis & Incident Response',
        'Defensive Malware Behavior Analysis',
        'Real-World Security Scenarios & Case Studies'
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
        description: 'Generate hashes for your data and visualize the avalanche effect.',
        href: '/tools/hash-generator',
        icon: Hash,
    },
    {
        id: '2',
        title: 'Text Encoder/Decoder',
        description: 'Encode and decode text using various formats like Base64 and URL.',
        href: '/tools/encoder-decoder',
        icon: KeyRound,
    },
    {
        id: '4',
        title: 'File Conversion Lab',
        description: 'A safe, client-side sandbox to convert formats and understand what’s happening.',
        href: '/tools/file-lab',
        icon: Files,
    }
];
