'use client';

import { usePathname } from 'next/navigation';
import { AssistantWidget } from '@/components/ai/assistant-widget';

function getPageContext(pathname: string): { pageContext: string; contextualData?: string } {
    if (pathname === '/') {
        return { pageContext: 'Home Page' };
    }
    if (pathname.startsWith('/blog/')) {
        const slug = pathname.split('/blog/')[1];
        return { pageContext: 'Blog Post', contextualData: `Slug: ${slug}` };
    }
    if (pathname === '/blog') {
        return { pageContext: 'Blog Page' };
    }
    if (pathname.startsWith('/learn/')) {
        const slug = pathname.split('/learn/')[1];
        return { pageContext: 'Learning Module', contextualData: `Slug: ${slug}` };
    }
    if (pathname === '/learn') {
        return { pageContext: 'Learn Page' };
    }
    if (pathname.startsWith('/tools/')) {
        const toolName = pathname.split('/tools/')[1].replace(/-/g, ' ');
        return { pageContext: 'Tool Page', contextualData: `Tool: ${toolName}` };
    }
    if (pathname === '/tools') {
        return { pageContext: 'Tools Page' };
    }
    if (pathname === '/dashboard') {
        return { pageContext: 'Dashboard' };
    }
    if (pathname === '/login' || pathname === '/signup') {
        return { pageContext: 'Auth Page' };
    }

    return { pageContext: 'Generic Page' };
}


export function AiProvider() {
    const pathname = usePathname();
    const { pageContext, contextualData } = getPageContext(pathname);

    // Don't show the widget on auth pages
    if (pageContext === 'Auth Page') {
        return null;
    }

    return (
        <AssistantWidget
            pageContext={pageContext}
            contextualData={contextualData}
        />
    );
}
