'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Loader2, UploadCloud, Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { PDFDocument } from 'pdf-lib';
import Papa from 'papaparse';
import { marked } from 'marked';
import { logFileConversionUsage } from '@/lib/firestore/fileLabHistory';

type ConversionType = 
    | 'txt-to-pdf' | 'txt-to-docx' 
    | 'md-to-pdf' | 'md-to-docx'
    | 'json-to-csv' | 'csv-to-json';

const conversionOptions = [
    { value: 'txt-to-pdf', label: 'Text → PDF' },
    { value: 'txt-to-docx', label: 'Text → DOCX' },
    { value: 'md-to-pdf', label: 'Markdown → PDF' },
    { value: 'md-to-docx', label: 'Markdown → DOCX' },
    { value: 'json-to-csv', label: 'JSON → CSV' },
    { value: 'csv-to-json', label: 'CSV → JSON' },
];

export default function FileLab() {
    const { user } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [conversionType, setConversionType] = useState<ConversionType>('txt-to-pdf');
    const [isLoading, setIsLoading] = useState(false);
    const [output, setOutput] = useState<{ blob: Blob, filename: string, type: string } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
            setOutput(null);
        }
    };

    const handleConvert = async () => {
        if (!file) return;

        setIsLoading(true);
        setOutput(null);

        try {
            const fileContent = await file.text();
            let resultBlob: Blob | null = null;
            let resultFilename = file.name.split('.')[0];
            let resultType = '';

            switch (conversionType) {
                case 'txt-to-pdf': {
                    const pdfDoc = await PDFDocument.create();
                    const page = pdfDoc.addPage();
                    page.drawText(fileContent);
                    const pdfBytes = await pdfDoc.save();
                    resultBlob = new Blob([pdfBytes], { type: 'application/pdf' });
                    resultFilename += '.pdf';
                    resultType = 'PDF';
                    break;
                }
                case 'txt-to-docx': {
                     const doc = new Document({
                        sections: [{
                            properties: {},
                            children: [new Paragraph({ children: [new TextRun(fileContent)] })],
                        }],
                    });
                    resultBlob = await Packer.toBlob(doc);
                    resultFilename += '.docx';
                    resultType = 'DOCX';
                    break;
                }
                case 'md-to-pdf': {
                    const html = await marked.parse(fileContent);
                    const pdfDoc = await PDFDocument.create();
                    const page = pdfDoc.addPage();
                    // This is a simplified conversion. For rich text, a more complex renderer is needed.
                    page.drawText(html.replace(/<[^>]*>?/gm, '')); // Stripping HTML for now
                    const pdfBytes = await pdfDoc.save();
                    resultBlob = new Blob([pdfBytes], { type: 'application/pdf' });
                    resultFilename += '.pdf';
                    resultType = 'PDF';
                    break;
                }
                 case 'md-to-docx': {
                    const html = await marked.parse(fileContent);
                    const doc = new Document({
                        sections: [{
                            properties: {},
                            children: [new Paragraph({ children: [new TextRun(html.replace(/<[^>]*>?/gm, ''))] })],
                        }],
                    });
                    resultBlob = await Packer.toBlob(doc);
                    resultFilename += '.docx';
                    resultType = 'DOCX';
                    break;
                }
                case 'json-to-csv': {
                    const json = JSON.parse(fileContent);
                    const csv = Papa.unparse(json);
                    resultBlob = new Blob([csv], { type: 'text/csv' });
                    resultFilename += '.csv';
                    resultType = 'CSV';
                    break;
                }
                case 'csv-to-json': {
                    const result = Papa.parse(fileContent, { header: true });
                    resultBlob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' });
                    resultFilename += '.json';
                    resultType = 'JSON';
                    break;
                }
            }

            if (resultBlob) {
                setOutput({ blob: resultBlob, filename: resultFilename, type: resultType });
                if (user) {
                    const [inputType, outputType] = conversionType.split('-to-');
                    logFileConversionUsage(user.uid, inputType, outputType);
                }
            }

        } catch (error) {
            console.error("Conversion failed:", error);
            // In a real app, show a toast notification here
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDownload = () => {
        if (output) {
            saveAs(output.blob, output.filename);
        }
    };

    return (
        <Card className="w-full max-w-4xl mx-auto shadow-xl">
            <div className="grid md:grid-cols-2">
                {/* Left Panel: Input */}
                <div className="p-6 border-b md:border-b-0 md:border-r">
                    <CardHeader className="p-0 mb-6">
                        <CardTitle className="font-headline text-xl">Input File</CardTitle>
                        <CardDescription>Select a file and choose the conversion type.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="file-upload">Upload File</Label>
                            <Input id="file-upload" type="file" onChange={handleFileChange} className="file:text-primary file:font-semibold"/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="conversion-type">Conversion</Label>
                            <Select value={conversionType} onValueChange={(v) => setConversionType(v as ConversionType)}>
                                <SelectTrigger id="conversion-type">
                                    <SelectValue placeholder="Select conversion type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {conversionOptions.map(opt => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                         <Button onClick={handleConvert} disabled={!file || isLoading} className="w-full">
                            {isLoading ? <Loader2 className="animate-spin"/> : 'Convert File'}
                        </Button>
                    </CardContent>
                </div>

                {/* Right Panel: Output */}
                <div className="p-6">
                    <CardHeader className="p-0 mb-6">
                        <CardTitle className="font-headline text-xl">Output</CardTitle>
                        <CardDescription>Your converted file will be available for download here.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 flex items-center justify-center h-48 bg-muted rounded-md border-2 border-dashed">
                        {!output && !isLoading && (
                             <div className="text-center text-muted-foreground">
                                <UploadCloud className="mx-auto h-10 w-10 mb-2"/>
                                <p>Awaiting conversion...</p>
                            </div>
                        )}
                        {isLoading && (
                            <Loader2 className="h-10 w-10 text-primary animate-spin"/>
                        )}
                        {output && (
                             <div className="text-center">
                                <p className="font-semibold text-lg">{output.filename}</p>
                                <p className="text-sm text-muted-foreground">{Math.round(output.blob.size / 1024)} KB</p>
                                <Button onClick={handleDownload} className="mt-4">
                                    <Download className="mr-2"/>
                                    Download {output.type}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </div>
            </div>
        </Card>
    );
}