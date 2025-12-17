
'use client';

import { useState, useEffect } from 'react';
import { generateHash } from '@/lib/security/hashEngine';
import { avalancheDifference } from '@/lib/security/avalanche';
import { explainHashing } from '@/lib/security/hashTutor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function HashGenerator() {
  const [text, setText] = useState('');
  const [altText, setAltText] = useState('');
  const [hash, setHash] = useState('');
  const [altHash, setAltHash] = useState('');
  const [algo, setAlgo] = useState<'SHA-256' | 'SHA-384' | 'SHA-512'>('SHA-256');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Clear hashes if the algorithm changes
    setHash('');
    setAltHash('');
  }, [algo]);

  async function run() {
    setIsLoading(true);
    const h1 = await generateHash(text, algo);
    setHash(h1);

    if (altText) {
      const h2 = await generateHash(altText, algo);
      setAltHash(h2);
    } else {
      setAltHash(''); // Clear alt hash if alt text is empty
    }
    setIsLoading(false);
  }

  const avalanche =
    hash && altHash ? avalancheDifference(hash, altHash) : null;

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader>
            <CardTitle className="font-headline text-2xl">Interactive Hash Visualizer</CardTitle>
            <CardDescription>See the powerful "avalanche effect" of cryptographic hashing in real-time.</CardDescription>
        </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className='space-y-2'>
                <Label htmlFor="input-a">Original Input</Label>
                <Textarea
                    id="input-a"
                    className="w-full p-2 mb-2 bg-background rounded-md h-32 font-mono"
                    placeholder="Type something here..."
                    value={text}
                    onChange={e => setText(e.target.value)}
                />
            </div>
            <div className='space-y-2'>
                <Label htmlFor="input-b">Modified Input</Label>
                <Textarea
                    id="input-b"
                    className="w-full p-2 mb-2 bg-background rounded-md h-32 font-mono"
                    placeholder="Change just one character..."
                    value={altText}
                    onChange={e => setAltText(e.target.value)}
                />
            </div>
        </div>

        <div className='space-y-2'>
            <Label htmlFor="algorithm">Algorithm</Label>
            <Select value={algo} onValueChange={(value) => setAlgo(value as any)}>
                <SelectTrigger id="algorithm">
                    <SelectValue placeholder="Select an algorithm" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="SHA-256">SHA-256</SelectItem>
                    <SelectItem value="SHA-384">SHA-384</SelectItem>
                    <SelectItem value="SHA-512">SHA-512</SelectItem>
                </SelectContent>
            </Select>
        </div>


      <Button
        onClick={run}
        disabled={isLoading || !text}
        className="block w-full"
      >
        {isLoading ? <Loader2 className="animate-spin" /> : 'Generate Hash'}
      </Button>

      {(hash || isLoading) && (
        <div className="mt-4 pt-4 border-t space-y-4">
            {hash && (
                <div className="space-y-1 animate-in fade-in duration-500">
                    <Label className="text-sm">Hash 1 (Original)</Label>
                    <p className="break-all text-sm font-mono p-2 bg-muted rounded-md">{hash}</p>
                </div>
            )}
            {altHash && (
                <div className="space-y-1 animate-in fade-in duration-500">
                    <Label className="text-sm">Hash 2 (Modified)</Label>
                    <p className="break-all text-sm font-mono p-2 bg-muted rounded-md">{altHash}</p>
                </div>
            )}

          {avalanche !== null && (
            <div className="space-y-2 animate-in fade-in duration-500">
                <Label>Analysis</Label>
                <div className="p-4 bg-accent/10 border-l-4 border-accent rounded-md">
                    <p className="font-semibold text-accent mb-2">Avalanche Difference: {avalanche}%</p>
                    <div className="prose prose-sm dark:prose-invert max-w-none text-accent-foreground/80">
                        <ReactMarkdown 
                            components={{ p: ({node, ...props}) => <p className="my-0" {...props} /> }}
                        >
                            {explainHashing({ algorithm: algo, avalanche: avalanche ?? undefined })}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
          )}

          {!avalanche && hash && (
                <div className="p-4 bg-muted/50 rounded-md animate-in fade-in duration-500">
                     <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown 
                            components={{ p: ({node, ...props}) => <p className="my-0" {...props} /> }}
                        >
                           {explainHashing({ algorithm: algo })}
                        </ReactMarkdown>
                    </div>
                </div>
          )}
        </div>
      )}
    </CardContent>
    </Card>
  );
}
