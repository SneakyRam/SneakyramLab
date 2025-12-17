
'use client';

import { useState, useRef, useEffect } from 'react';
import { useAssistant } from '@/contexts/ai-assistant-context';
import { Bot, Loader2, Sparkles } from 'lucide-react';
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
import { QuickReplyButton } from './quick-reply-button';

type QuickReply = {
  label: string;
  query: string;
};

type Message = {
  id: string;
  type: 'user' | 'bot';
  text: string;
  quickReplies?: QuickReply[];
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

const getWelcomeMessage = (pageContext: string): Message => {
    if (pageContext.includes('password-strength-checker')) {
        return {
            id: 'welcome',
            type: 'bot',
            text: `You’re on the **Password Strength Checker**.\n\nThis tool helps you understand password security. What would you like to do?`,
            quickReplies: [
              { label: "Test a password", query: "How do I test a password?" },
              { label: "Explain weak passwords", query: "Why are some passwords weak?" },
              { label: "What is 'entropy'?", query: "What is password entropy?" },
            ]
        };
    }
    if (pageContext.includes('hash-generator')) {
        return {
            id: 'welcome',
            type: 'bot',
            text: `You’re using the **Hash Generator**.\n\nThis tool converts text into a cryptographic hash. Want a quick demo or an explanation?`,
            quickReplies: [
              { label: "Explain hashing", query: "What is cryptographic hashing?" },
              { label: "Suggest an experiment", query: "Suggest a hashing experiment" },
              { label: "How do I use this?", query: "How do I use this tool?" },
            ]
        };
    }
    return {
        id: 'welcome',
        type: 'bot',
        text: `Hello! I'm your AI cybersecurity tutor. How can I help you today?`,
        quickReplies: [
          { label: "What is hashing?", query: "What is hashing?" },
          { label: "Check a password", query: "Is my password 'password123' good?" },
        ]
    };
};

export function AssistantWidget({
  pageContext,
  page,
}: {
  pageContext: string;
  page: string;
}) {
  const { isOpen } = useAssistant();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([getWelcomeMessage(pageContext)]);
  }, [pageContext, page]);


  useEffect(() => {
    if (isOpen && scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isOpen]);

  const handleSendQuery = async (query: string) => {
    if (!query.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), type: 'user', text: query };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuery: query,
          pageContext,
          page,
        }),
      });

      if (!res.ok) {
        throw new Error('API request failed');
      }

      const data = await res.json();
      const botMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        type: 'bot', 
        text: data.response.text,
        quickReplies: data.response.quickReplies,
      };
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendQuery(input);
  };

  const handleQuickReply = (query: string) => {
    handleSendQuery(query);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
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
                    'flex flex-col gap-2',
                    message.type === 'user' ? 'items-end' : 'items-start'
                  )}
                >
                  <div
                      className={cn(
                      'flex gap-3 text-sm w-full',
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
                  {message.type === 'bot' && message.quickReplies && (
                    <div className="flex flex-wrap gap-2 pl-10">
                        {message.quickReplies.map((reply, index) => (
                            <QuickReplyButton 
                                key={index} 
                                onClick={() => handleQuickReply(reply.query)}
                                disabled={isLoading}
                            >
                                {reply.label}
                            </QuickReplyButton>
                        ))}
                    </div>
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
  );
}
