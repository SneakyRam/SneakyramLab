
'use client';

import { useState, useMemo } from 'react';
import { encode, decode, EncodingType } from '@/lib/security/textEncoderEngine';
import { explainEncoding } from '@/lib/security/encoderTutor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { ArrowRightLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';


export default function TextEncoderDecoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [type, setType] = useState<EncodingType>('base64');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const explanation = useMemo(() => explainEncoding(type), [type]);

  const handleProcess = () => {
    if (mode === 'encode') {
      setOutput(encode(input, type));
    } else {
      setOutput(decode(input, type));
    }
  };

  const handleSwap = () => {
    setInput(output);
    setOutput(input);
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader>
            <CardTitle className="font-headline text-2xl">Interactive Encoder</CardTitle>
            <CardDescription>Encoding makes data safe to transport, but it is not a security measure for secrecy. It's easily reversible.</CardDescription>
        </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div className='space-y-2'>
                <Label htmlFor="encoding-type">Encoding Type</Label>
                <Select value={type} onValueChange={(value: EncodingType) => setType(value)}>
                    <SelectTrigger id="encoding-type">
                        <SelectValue placeholder="Select an encoding" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="base64">Base64</SelectItem>
                        <SelectItem value="url">URL (Percent)</SelectItem>
                        <SelectItem value="html">HTML Entities</SelectItem>
                        <SelectItem value="hex">Hexadecimal</SelectItem>
                        <SelectItem value="binary">Binary</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex gap-2">
                <Button onClick={() => { setMode('encode'); handleProcess(); }} className="w-full" disabled={!input}>Encode</Button>
                <Button onClick={() => { setMode('decode'); handleProcess(); }} variant="secondary" className="w-full" disabled={!input}>Decode</Button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
            <div className="space-y-2">
                <Label htmlFor="input-text">Input</Label>
                <Textarea
                    id="input-text"
                    placeholder="Enter text to process..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    className="h-40 font-mono"
                />
            </div>
            
            <Button variant="ghost" size="icon" onClick={handleSwap} aria-label="Swap input and output">
                <ArrowRightLeft />
            </Button>
            
            <div className="space-y-2">
                <Label htmlFor="output-text">Output</Label>
                <Textarea
                    id="output-text"
                    placeholder="Result will appear here..."
                    value={output}
                    readOnly
                    className="h-40 font-mono bg-muted/50"
                />
            </div>
        </div>
        
        <div className="mt-4 pt-4 border-t">
             <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                <ReactMarkdown components={{ p: ({node, ...props}) => <p className="my-0" {...props} /> }}>
                    {explanation}
                </ReactMarkdown>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
