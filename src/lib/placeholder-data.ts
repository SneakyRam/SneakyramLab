
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
    id: 'foundations',
    slug: 'cybersecurity-foundations',
    title: 'Cybersecurity Foundations',
    level: 'Beginner',
    description: 'Build correct mental models before touching any tools or attacks. This is the right place to start.',
    order: 1,
    isPublished: true,
    estimatedWeeks: 4,
    modules: [
      {
        id: 'internet-works',
        title: 'How the Internet Works',
        description: 'Understand the foundational protocols and ideas that make the web possible.',
        order: 1,
        isPublished: true,
        lessons: [
          { id: 'what-is-internet', title: 'What is the Internet?', type: 'theory', difficulty: 'Beginner', estimatedTime: 10, content: 'The Internet is a global network of computers that communicate using agreed rules called protocols.\n\nWhen one computer wants data, it sends a request. Another computer responds with data.\n\nSecurity exists because:\n- Requests can be intercepted\n- Data can be modified\n- Identity can be faked\n\nIf you understand the Internet, you understand where security breaks.' },
          { id: 'client-vs-server', title: 'Client vs. Server', type: 'theory', difficulty: 'Beginner', estimatedTime: 5, content: 'A **client** requests data.\nA **server** provides data.\n\nExamples:\n- Browser → Client\n- Website backend → Server\n\nSecurity problems happen when:\n- The server trusts the client too much\n- The client assumes the server is safe' },
          { id: 'what-happens-url', title: 'What happens when you type a URL?', type: 'theory', difficulty: 'Beginner', estimatedTime: 15, content: '1. DNS resolves domain → IP\n2. Browser opens connection\n3. HTTPS handshake happens\n4. HTTP request is sent\n5. Server responds\n\n**Security relevance:**\n- DNS spoofing\n- MITM attacks\n- HTTPS encryption' },
          { id: 'http-basics', title: 'HTTP Basics', type: 'theory', difficulty: 'Beginner', estimatedTime: 15, content: 'HTTP is a request–response protocol.\n\n**Methods:**\n- GET\n- POST\n- PUT\n- DELETE\n\n**Status codes:**\n- 200 OK\n- 401 Unauthorized\n- 403 Forbidden\n- 500 Server Error\n\nSecurity often depends on correct status codes.' },
        ]
      },
      {
        id: 'auth-fundamentals',
        title: 'Authentication Fundamentals',
        description: 'Learn how we prove identity online and where it goes wrong.',
        order: 2,
        isPublished: true,
        lessons: [
          { id: 'what-is-auth', title: 'What is Authentication?', type: 'theory', difficulty: 'Beginner', estimatedTime: 10, content: 'Authentication answers: "Who are you?"\n\nAuthorization answers: "What are you allowed to do?"\n\nConfusing these leads to serious vulnerabilities.' },
          { id: 'passwords-good-bad', title: 'Passwords: Good vs. Bad', type: 'practice', difficulty: 'Beginner', estimatedTime: 15, content: 'Bad passwords are:\n- short\n- reused\n- predictable\n\nGood passwords are:\n- long\n- unique\n- stored as hashes\n\nPasswords are the weakest link in security.' },
          { id: 'why-hashing-matters', title: 'Why Hashing Matters', type: 'theory', difficulty: 'Beginner', estimatedTime: 15, content: 'Passwords should never be stored as plain text.\n\nHashing is a:\n- One-way function\n- Same input → same output\n- Impossible to reverse (ideally)\n\nSecurity depends on:\n- hashing algorithm\n- salting\n- rate limiting' },
          { id: 'login-flow-explained', title: 'Login Flow Explained', type: 'theory', difficulty: 'Beginner', estimatedTime: 10, content: '1. User submits credentials\n2. Server verifies hash\n3. Session/token is issued\n4. User stays logged in\n\nSecurity failures here cause:\n- account takeover\n- session hijacking' },
        ]
      },
      {
        id: 'sessions-identity',
        title: 'Sessions & Identity',
        description: 'How does a website remember you?',
        order: 3,
        isPublished: true,
        lessons: [
            { id: 'cookies-explained', title: 'Cookies Explained', type: 'theory', difficulty: 'Beginner', estimatedTime: 15, content: 'Cookies store small data in the browser.\n\nSession cookies:\n- identify the user\n- sent with every request\n\nSecurity risks:\n- XSS\n- CSRF' },
            { id: 'tokens-vs-sessions', title: 'Tokens vs. Sessions', type: 'demo', difficulty: 'Beginner', estimatedTime: 15, content: 'Sessions:\n- stored on server\n- safer, stateful\n\nTokens:\n- stored on client\n- scalable, stateless\n\nBoth can be secure if implemented correctly.' },
        ]
      },
      {
        id: 'security-mindset',
        title: 'Security Mindset',
        description: 'Learn to think like a defender.',
        order: 4,
        isPublished: true,
        lessons: [
            { id: 'trust-is-dangerous', title: 'Trust is Dangerous', type: 'theory', difficulty: 'Beginner', estimatedTime: 10, content: 'Never trust:\n- user input\n- headers\n- client-side logic\n\nAssume:\n- users can lie\n- requests can be modified' },
            { id: 'why-systems-block', title: 'Why Systems Block Users', type: 'theory', difficulty: 'Beginner', estimatedTime: 10, content: 'Blocks happen due to:\n- repeated failures\n- suspicious behavior\n- risk scoring\n\nThis protects users, not punishes them.' },
            { id: 'rate-limiting', title: 'Rate Limiting', type: 'theory', difficulty: 'Beginner', estimatedTime: 10, content: 'Rate limiting controls:\n- login attempts\n- API abuse\n\nWithout it:\n- brute force attacks succeed' },
            { id: 'captcha-explained', title: 'CAPTCHA – Why it Exists', type: 'theory', difficulty: 'Beginner', estimatedTime: 5, content: 'CAPTCHA differentiates:\n- humans\n- bots\n\nModern systems use adaptive CAPTCHA.' },
        ]
      },
      {
        id: 'defensive-thinking',
        title: 'Defensive Thinking',
        description: 'The core principles of blue-team thinking.',
        order: 5,
        isPublished: true,
        lessons: [
            { id: 'logging-basics', title: 'Logging Basics', type: 'theory', difficulty: 'Beginner', estimatedTime: 10, content: 'Logs record:\n- logins\n- failures\n- errors\n\nNo logs = no visibility.' },
            { id: 'monitoring-alerts', title: 'Monitoring & Alerts', type: 'theory', difficulty: 'Beginner', estimatedTime: 10, content: 'Monitoring detects problems early.\n\nAlerts should be:\n- meaningful\n- actionable' },
            { id: 'risk-scores', title: 'Risk Scores Explained', type: 'theory', difficulty: 'Beginner', estimatedTime: 10, content: 'Risk scores combine:\n- behavior\n- history\n- context\n\nSecurity is probabilistic, not absolute.' },
            { id: 'account-lockouts', title: 'Account Lockouts', type: 'theory', difficulty: 'Beginner', estimatedTime: 5, content: 'Lockouts prevent:\n- brute force\n- account takeover\n\nToo strict = bad UX\nToo loose = insecure' },
            { id: 'security-tradeoffs', title: 'Security is Trade-offs', type: 'theory', difficulty: 'Beginner', estimatedTime: 5, content: 'Security balances:\n- usability\n- safety\n- cost' },
            { id: 'thinking-like-defender', title: 'Thinking Like a Defender', type: 'theory', difficulty: 'Beginner', estimatedTime: 5, content: 'Defenders:\n- assume breach\n- monitor behavior\n- respond quickly\n\nThis mindset matters more than tools.' },
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

    
