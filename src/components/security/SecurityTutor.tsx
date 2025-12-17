'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Progress } from '../ui/progress';
import { cn } from '@/lib/utils';
import { generatePassword } from '@/lib/security/passwordGenerator';
import { RefreshCw, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';


export default function SecurityTutor() {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);


  async function checkPassword() {
    if (!password) {
        setResult(null);
        return;
    }
    setIsLoading(true);
    const res = await fetch('/api/security/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    setResult(data);
    setIsLoading(false);
  }

  function handleGeneratePassword() {
      const newPassword = generatePassword();
      setPassword(newPassword);
      // We are not auto-analyzing here to let the user see the generated password first.
      // They can then click "Analyze".
      setResult(null);
  }
  
  const score = result?.analysis?.score || 0;

  const getBarColor = () => {
    if (score < 30) return 'bg-red-500';
    if (score < 50) return 'bg-orange-500';
    if (score < 70) return 'bg-yellow-500';
    if (score < 90) return 'bg-green-500';
    return 'bg-emerald-500';
  };

  return (
    <Card className="w-full max-w-xl mx-auto shadow-xl">
        <CardHeader>
            <CardTitle className="font-headline text-2xl">Password Strength Checker</CardTitle>
            <CardDescription>Enter a password to see its strength, estimated time to crack, and tips for improvement. Your password is never stored.</CardDescription>
        </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-2">
            <Input
                type="text"
                value={password}
                onChange={e => {
                    setPassword(e.target.value);
                    setResult(null); // Clear previous results on edit
                }}
                className="flex-grow text-lg h-12"
                placeholder="Enter a password to analyze"
            />
            <Button
                onClick={checkPassword}
                disabled={isLoading || !password}
                className="h-12 px-6"
            >
                {isLoading ? <Loader2 className="animate-spin" /> : 'Analyze'}
            </Button>
        </div>
        <div className="mt-4">
            <Button onClick={handleGeneratePassword} variant="outline" size="sm">
                <RefreshCw className="mr-2"/>
                Generate Secure Password
            </Button>
        </div>

      {result && !isLoading && (
        <div className="mt-6 space-y-4 animate-in fade-in duration-500">
            <Progress value={score} className={cn("h-2 [&>div]:transition-all [&>div]:duration-700", getBarColor())} />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex flex-col">
                    <span className="text-muted-foreground">Strength</span>
                    <span className="font-semibold text-lg">{result.analysis.verdict}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-muted-foreground">Est. crack time</span>
                    <span className="font-semibold text-lg">{result.analysis.crackTimeHuman}</span>
                </div>
            </div>

            <div className="prose prose-sm dark:prose-invert bg-muted/50 p-4 rounded-md">
                <ReactMarkdown
                    components={{
                        p: ({node, ...props}) => <p className="my-0" {...props} />,
                    }}
                >{result.explanation}</ReactMarkdown>
            </div>
        </div>
      )}
      </CardContent>
    </Card>
  );
}
