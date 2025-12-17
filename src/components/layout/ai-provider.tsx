'use client';

import { usePathname } from 'next/navigation';
import { AssistantWidget } from '@/components/ai/assistant-widget';

function getPageContext(pathname: string): { page: string; pageContext: string; } {
    if (pathname === '/') {
        return { page: 'Home Page', pageContext: 'User is on the main landing page.' };
    }
    if (pathname.startsWith('/blog/')) {
        const slug = pathname.split('/blog/')[1];
        return { page: 'Blog Post', pageContext: `user is viewing blog post with slug: ${slug}` };
    }
    if (pathname === '/blog') {
        return { page: 'Blog Page', pageContext: 'User is browsing the list of blog posts.' };
    }
    if (pathname.startsWith('/learn/')) {
        const slug = pathname.split('/learn/')[1];
        return { page: 'Learning Module', pageContext: `User is viewing learning module with slug: ${slug}` };
    }
    if (pathname === '/learn') {
        return { page: 'Learn Page', pageContext: 'User is browsing the learning modules.' };
    }
    if (pathname.startsWith('/tools/')) {
        const toolName = pathname.split('/tools/')[1].replace(/-/g, ' ');
        return { page: 'Tool Page', pageContext: `User is on the ${toolName} tool page.` };
    }
    if (pathname === '/tools') {
        return { page: 'Tools Page', pageContext: 'User is browsing the available tools.' };
    }
    if (pathname === '/dashboard') {
        return { page: 'Dashboard', pageContext: 'User is on their personal dashboard.' };
    }
    if (pathname === '/login' || pathname === '/signup') {
        return { page: 'Auth Page', pageContext: 'User is on an authentication page.' };
    }

    return { page: 'Generic Page', pageContext: 'User is on a generic page.' };
}


export function AiProvider() {
    const pathname = usePathname();
    const { page, pageContext } = getPageContext(pathname);

    // Don't show the widget on auth pages
    if (page === 'Auth Page') {
        return null;
    }

    return (
        <AssistantWidget
            page={page}
            pageContext={pageContext}
        />
    );
}
