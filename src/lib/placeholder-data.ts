
import type { BlogPost, Tool } from '@/lib/types';
import { ShieldCheck, Hash, KeyRound, Files } from 'lucide-react';

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
  {
    id: '4',
    title: 'Linux: The Foundation of Modern Computing and Digital Security',
    slug: 'linux-foundation-of-modern-computing',
    category: 'Operating Systems',
    difficulty: 'Intermediate',
    content: 'An in-depth analysis of the Linux operating system, from its kernel architecture and security features to its dominance in cloud computing, DevOps, and cybersecurity.',
    tags: ['Linux', 'Cybersecurity', 'Cloud Computing', 'Kernel', 'DevOps'],
    author: 'sneakyram',
    authorId: 'admin1',
    publishedAt: new Date(),
    isPublished: true,
    featuredImage: {
        src: 'https://picsum.photos/seed/104/1200/800',
        alt: 'Abstract digital illustration of the Linux kernel.',
        aiHint: 'linux kernel'
    }
  }
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
