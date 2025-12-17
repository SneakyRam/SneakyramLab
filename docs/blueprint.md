# **App Name**: CyberLearn Central

## Core Features:

- User Authentication: Secure user login and registration with Firebase Authentication, supporting email/password and Google sign-in. User data stored in Firestore.
- Blog Publishing: Admin interface for creating, editing, and publishing blog posts with titles, slugs, categories, difficulty levels, Markdown content, tags, authors, and publish/unpublish status. Incorporate AI tools to assist with title optimization and meta description suggestions. User login information will be used as a tool to inform admin-level analytics.
- Learning Modules: Structured lessons in a /learn section with step-by-step topics, linking to blog posts and tools. User progress saved to Firestore.
- Mini Tools: A /tools section offering utilities such as a PDF to DOC converter, text encoder/decoder, hash generator, password strength checker, and a password tool that estimates strength, detects weak patterns, and explains weaknesses using AI to educate users on secure password creation.
- User Dashboard: Personalized dashboard displaying profile information, learning progress, saved blogs, and recently used tools.
- Firestore Integration: Utilize Firestore to store user data, blog content, lesson progress, and tool usage logs, ensuring secure and efficient data management.
- Role-Based Access Control: Implement role-based access control to manage user permissions, ensuring users can only access their own data and admins have necessary write permissions.

## Style Guidelines:

- Primary color: Deep blue (#2962FF) for trustworthiness and stability.
- Background color: Light gray (#F0F4F8) for a clean and modern look.
- Accent color: Electric purple (#A044FF) for highlighting interactive elements and CTAs.
- Headline font: 'Space Grotesk' sans-serif for headers; body font: 'Inter' sans-serif for longer texts.
- Use simple, geometric icons to represent categories, tools, and actions.
- Clean, mobile-first layout optimized for readability and usability on all devices.
- Subtle transitions and animations to enhance user experience and provide feedback on interactions, respecting reduced-motion preferences.