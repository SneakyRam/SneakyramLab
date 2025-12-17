
'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Loader2, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { User as UserIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

type Message = {
  id: string;
  type: 'user' | 'bot';
  text: string;
};

const getPlaceholderText = (pageContext: string) => {
    if (pageContext.includes('password-strength-checker')) {
        return `Ask: "Is 'P@ssw0rd!23' strong?"`;
    }
    if (pageContext.includes('hash-generator')) {
        return `Ask: "What is the avalanche effect?"`;
    }
    return 'Ask a cybersecurity question...';
};

const getWelcomeMessage = (pageContext: string) => {
    if (pageContext.includes('password-strength-checker')) {
        return `You’re on the **Password Strength Checker**.

This tool helps you:
• Understand why a password is weak or strong
• Learn how attackers guess passwords
• Improve passwords using real security principles

You can:
1. Paste a password to test
2. Ask why a password is weak
3. Learn how to create strong passwords

What would you like to try?`;
    }
    if (pageContext.includes('hash-generator')) {
        return `You’re using the **Hash Generator**.

This tool converts text into a cryptographic hash.
Hashes are used to:
• Verify data integrity
• Store passwords securely
• Detect tampering

You can:
1. Hash any text
2. Compare algorithms (SHA-256, SHA-512)
3. Learn why hashes can’t be reversed

Want a quick demo or an explanation?`;
    }
    return `Hello! I'm your AI cybersecurity tutor. How can I help you today?`;
};

export function AssistantWidget({
  pageContext,
  page,
}: {
  pageContext: string;
  page: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // This effect resets the chat when the user navigates to a new page.
  useEffect(() => {
    setMessages([
        {
            id: 'welcome',
            type: 'bot',
            text: getWelcomeMessage(pageContext),
        },
    ]);
  }, [pageContext, page]);


  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), type: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuery: input,
          pageContext,
          page,
        }),
      });

      if (!res.ok) {
        throw new Error('API request failed');
      }

      const data = await res.json();
      const botMessage: Message = { id: (Date.now() + 1).toString(), type: 'bot', text: data.response };
      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error('AI Assistant Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg bg-accent hover:bg-accent/90"
          onClick={handleToggle}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
          <span className="sr-only">Toggle AI Assistant</span>
        </Button>
      </div>

      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50">
          <Card className="w-80 shadow-2xl md:w-96">
            <CardHeader className="flex flex-row items-start gap-2">
                <Sparkles className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <CardTitle className="font-headline">AI Assistant</CardTitle>
                <CardDescription>
                  Your cybersecurity tutor.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-72 pr-4" ref={scrollAreaRef as any}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        'flex gap-3 text-sm',
                        message.type === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {message.type === 'bot' && (
                        <Avatar className="h-8 w-8">
                            <AvatarFallback><Bot className="h-5 w-5" /></AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          'max-w-[85%] rounded-lg px-3 py-2 prose prose-sm dark:prose-invert',
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        )}
                      >
                        <ReactMarkdown
                            components={{
                                p: ({node, ...props}) => <p className="my-0" {...props} />,
                            }}
                        >{message.text}</ReactMarkdown>
                      </div>
                       {message.type === 'user' && (
                        <Avatar className="h-8 w-8">
                            <AvatarFallback><UserIcon className="h-5 w-5" /></AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start gap-3 text-sm">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback><Bot className="h-5 w-5" /></AvatarFallback>
                        </Avatar>
                        <div className="max-w-[85%] rounded-lg p-2 bg-muted flex items-center">
                            <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <form onSubmit={handleSubmit} className="flex w-full gap-2">
                <Input
                  placeholder={getPlaceholderText(pageContext)}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !input.trim()}>
                  Send
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}
