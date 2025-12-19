
import type { BlogPost, LearningPath, Tool } from '@/lib/types';
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

export const learningPaths: LearningPath[] = [
  {
    id: '1',
    title: 'Web Security Fundamentals',
    slug: 'web-security-fundamentals',
    description: 'Best for: absolute beginners or anyone who wants strong fundamentals. This path teaches you how hacking actually works (ethically) and how defenders think. No assumptions. No prior experience needed.',
    difficulty: 'Beginner',
    outcomes: [
        'Explain cybersecurity clearly to others',
        'Understand vulnerabilities at a conceptual level',
        'Avoid common beginner mistakes that slow people down'
    ],
    modules: [
        {
            id: 'http-browsers',
            title: 'HTTP & Browsers',
            description: 'Understanding the core of the web.',
            lessons: [
                { id: 'how-http-works', title: 'How HTTP Works', estimatedTime: '15 min', content: 'Lesson content for how HTTP works.' },
                { id: 'cookies-sessions', title: 'Cookies & Sessions', estimatedTime: '20 min', content: 'Lesson content for cookies and sessions.' },
            ]
        },
        {
            id: 'authentication',
            title: 'Authentication',
            description: 'How we prove who we are online.',
            lessons: [
                 { id: 'passwords-hashing', title: 'Passwords & Hashing', estimatedTime: '30 min', content: 'Lesson content for passwords and hashing.' },
                 { id: 'jwt-vs-sessions', title: 'JWT vs. Sessions', estimatedTime: '25 min', content: 'Lesson content for JWTs.' },
            ]
        }
    ]
  },
  {
    id: '2',
    title: 'Advanced Defensive Techniques',
    slug: 'advanced-defensive-techniques',
    description: 'Best for: learners who want deep technical and defensive expertise. This path focuses on how organizations protect real infrastructure and respond to attacks in the real world.',
    difficulty: 'Advanced',
    outcomes: [
        'Understand enterprise security architecture',
        'Explain modern defensive strategies',
        'Think like a blue-team security engineer'
    ],
    modules: [
         {
            id: 'network-defense',
            title: 'Network Defense',
            description: 'Protecting the perimeter.',
            lessons: [
                { id: 'firewalls-ids-ips', title: 'Firewalls, IDS/IPS', estimatedTime: '45 min', content: 'Lesson content for defensive tools.' },
                { id: 'secure-network-design', title: 'Secure Network Design', estimatedTime: '40 min', content: 'Lesson content for secure network design.' },
            ]
        },
        {
            id: 'incident-response',
            title: 'Incident Response',
            description: 'Reacting to a breach.',
            lessons: [
                { id: 'log-analysis', title: 'Log Analysis & Threat Hunting', estimatedTime: '1.5 hours', content: 'Lesson content for log analysis.' },
                { id: 'malware-analysis-basics', title: 'Intro to Malware Analysis', estimatedTime: '1 hour', content: 'Lesson content for malware analysis.' },
            ]
        }
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
