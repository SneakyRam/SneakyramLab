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
    description: 'Best for: absolute beginners or anyone who wants strong fundamentals. This path teaches you how hacking actually works (ethically) and how defenders think. No assumptions. No prior experience needed.',
    difficulty: 'Beginner',
    time: '2-3 weeks',
    outcomes: [
        'Explain cybersecurity clearly to others',
        'Understand vulnerabilities at a conceptual level',
        'Avoid common beginner mistakes that slow people down'
    ],
    lessons: [
        { id: 'intro-to-cyber', title: 'What is Cybersecurity & Ethical Hacking', estimatedTime: '15 min', content: 'Lesson content for intro to cyber.' },
        { id: 'how-internet-works', title: 'How the Internet Works (DNS, HTTP, TCP/IP)', estimatedTime: '25 min', content: 'Lesson content for how the internet works.' },
        { id: 'linux-basics', title: 'Linux & Command Line Basics', estimatedTime: '45 min', content: 'Lesson content for linux basics.' },
        { id: 'passwords-hashing', title: 'Passwords, Hashing & Authentication', estimatedTime: '30 min', content: 'Lesson content for passwords and hashing.' },
        { id: 'common-attacks', title: 'Common Attack Types', estimatedTime: '20 min', content: 'Lesson content for common attacks.' },
        { id: 'ethics', title: 'Security Mindset & Ethics', estimatedTime: '15 min', content: 'Lesson content for ethics.' },
    ]
  },
  {
    id: '2',
    title: 'Web Application Security & Bug Hunting',
    slug: 'web-application-security',
    description: 'Best for: learners who know the basics and want real-world relevance. This path shows you where vulnerabilities actually hide in modern web applications and how professionals analyze them.',
    difficulty: 'Intermediate',
    time: '4-6 weeks',
    outcomes: [
        'Identify common web vulnerabilities',
        'Understand professional security reports',
        'Think like an ethical security tester'
    ],
    lessons: [
        { id: 'how-web-apps-work', title: 'How Web Applications Work', estimatedTime: '20 min', content: 'Lesson content for how web apps work.' },
        { id: 'auth-sessions', title: 'Authentication & Session Security', estimatedTime: '30 min', content: 'Lesson content for auth and sessions.' },
        { id: 'owasp-top-10', title: 'OWASP Top 10', estimatedTime: '1 hour', content: 'Lesson content for OWASP Top 10.' },
        { id: 'secure-password-storage', title: 'Secure Password Storage & Hashing', estimatedTime: '25 min', content: 'Lesson content for secure password storage.' },
        { id: 'input-validation', title: 'Input Validation & Data Sanitization', estimatedTime: '20 min', content: 'Lesson content for input validation.' },
        { id: 'bug-bounty-mindset', title: 'Bug Bounty & Responsible Disclosure Mindset', estimatedTime: '15 min', content: 'Lesson content for bug bounty mindset.' },
    ]
  },
  {
    id: '3',
    title: 'Advanced Network Defense & Blue Teaming',
    slug: 'advanced-network-defense',
    description: 'Best for: learners who want deep technical and defensive expertise. This path focuses on how organizations protect real infrastructure and respond to attacks in the real world.',
    difficulty: 'Advanced',
    time: '6-8 weeks',
    outcomes: [
        'Understand enterprise security architecture',
        'Explain modern defensive strategies',
        'Think like a blue-team security engineer'
    ],
    lessons: [
        { id: 'network-architecture', title: 'Network Architecture & Threat Models', estimatedTime: '45 min', content: 'Lesson content for network architecture.' },
        { id: 'defensive-tools', title: 'Firewalls, IDS/IPS & SIEM Fundamentals', estimatedTime: '1 hour', content: 'Lesson content for defensive tools.' },
        { id: 'secure-network-design', title: 'Secure Network Design Principles', estimatedTime: '40 min', content: 'Lesson content for secure network design.' },
        { id: 'log-analysis', title: 'Log Analysis & Incident Response', estimatedTime: '1.5 hours', content: 'Lesson content for log analysis.' },
        { id: 'malware-analysis', title: 'Defensive Malware Behavior Analysis', estimatedTime: '1 hour', content: 'Lesson content for malware analysis.' },
        { id: 'real-world-scenarios', title: 'Real-World Security Scenarios & Case Studies', estimatedTime: '30 min', content: 'Lesson content for real-world scenarios.' },
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
