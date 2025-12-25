

import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { AssistantProvider } from '@/contexts/ai-assistant-context';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { AuthProvider } from '@/contexts/auth-provider';
import { AiProvider } from '@/components/layout/ai-provider';

export const metadata: Metadata = {
  title: 'Hack the Why',
  description: 'A platform for learning cybersecurity through understanding.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{colorScheme: 'dark'}} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn('min-h-screen bg-background font-body antialiased')}
      >
        <AuthProvider>
          <AssistantProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <AiProvider />
            <Toaster />
          </AssistantProvider>
        </AuthProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
