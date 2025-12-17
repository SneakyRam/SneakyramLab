'use client';

import { useState } from 'react';
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

type Message = {
  id: string;
  type: 'user' | 'bot';
  text: string;
};

export function AssistantWidget({
  pageContext,
  contextualData,
}: {
  pageContext: string;
  contextualData?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          type: 'bot',
          text: `Hello! I'm your AI assistant. How can I help you with ${pageContext.toLowerCase()} today?`,
        },
      ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

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
          contextualData,
        }),
      });

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
              <ScrollArea className="h-72 pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        'flex gap-2 text-sm',
                        message.type === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {message.type === 'bot' && (
                        <Bot className="h-5 w-5 flex-shrink-0" />
                      )}
                      <div
                        className={cn(
                          'max-w-[85%] rounded-lg p-2',
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        )}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start gap-2 text-sm">
                        <Bot className="h-5 w-5 flex-shrink-0" />
                        <div className="max-w-[85%] rounded-lg p-2 bg-muted">
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
                  placeholder="Ask a question..."
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
