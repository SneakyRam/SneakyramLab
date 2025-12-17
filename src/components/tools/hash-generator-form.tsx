"use client";

import { useState } from "react";
import { useAuth, useFirestore } from "@/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Copy, Loader2 } from "lucide-react";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

type HashAlgorithm = "SHA-256" | "SHA-512" | "MD5";

// A simple client-side implementation for MD5 as it's not in Web Crypto API
function simpleMd5(str: string) {
    // This is a basic implementation for educational purposes, not for production security.
    // In a real app, you'd use a robust library if MD5 was truly needed.
    function rotateLeft(lValue: number, iShiftBits: number) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }

    function addUnsigned(lX: number, lY: number) {
        let lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        if (lX4 | lY4) {
            if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
        } else return (lResult ^ lX8 ^ lY8);
    }

    function F(x: number, y: number, z: number) { return (x & y) | ((~x) & z); }
    function G(x: number, y: number, z: number) { return (x & z) | (y & (~z)); }
    function H(x: number, y: number, z: number) { return (x ^ y ^ z); }
    function I(x: number, y: number, z: number) { return (y ^ (x | (~z))); }

    function FF(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
        a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }
    function GG(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
        a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }
    function HH(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
        a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }
    function II(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
        a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }

    function convertToWordArray(str: string) {
        let lWordCount;
        let lMessageLength = str.length;
        let lNumberOfWords_temp1 = lMessageLength + 8;
        let lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        let lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        let lWordArray = Array(lNumberOfWords - 1);
        let lBytePosition = 0;
        let lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = (lWordArray[lWordCount] | (0x80 << lBytePosition));
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    }

    function wordToHex(lValue: number) {
        let WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        return WordToHexValue;
    }

    let x = Array<any>();
    let k, AA, BB, CC, DD, a, b, c, d;
    let S11 = 7, S12 = 12, S13 = 17, S14 = 22;
    let S21 = 5, S22 = 9, S23 = 14, S24 = 20;
    let S31 = 4, S32 = 11, S33 = 16, S34 = 23;
    let S41 = 6, S42 = 10, S43 = 15, S44 = 21;

    x = convertToWordArray(str);
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

    for (k = 0; k < x.length; k += 16) {
        AA = a; BB = b; CC = c; DD = d;
        a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = addUnsigned(a, AA);
        b = addUnsigned(b, BB);
        c = addUnsigned(c, CC);
        d = addUnsigned(d, DD);
    }
    let temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
    return temp.toLowerCase();
}


export function HashGeneratorForm() {
    const [inputText, setInputText] = useState("");
    const [hashedOutput, setHashedOutput] = useState("");
    const [algorithm, setAlgorithm] = useState<HashAlgorithm>("SHA-256");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const { user } = useAuth();
    const firestore = useFirestore();

    const logToolUsage = async () => {
        if (!user || !firestore) return;

        const logData = {
            userId: user.uid,
            toolName: "Hash Generator",
            timestamp: serverTimestamp(),
        };

        try {
            const logsCollection = collection(firestore, "tool_usage_logs");
            addDoc(logsCollection, logData).catch(error => {
                const permissionError = new FirestorePermissionError({
                    path: logsCollection.path,
                    operation: 'create',
                    requestResourceData: logData,
                });
                errorEmitter.emit('permission-error', permissionError);
            });
        } catch (error) {
            console.error("Error logging tool usage:", error);
            // Non-critical, so we don't show a toast
        }
    };
    
    const generateHash = async () => {
        if (!inputText) {
            toast({
                variant: "destructive",
                title: "Input required",
                description: "Please enter some text to hash.",
            });
            return;
        }

        setIsLoading(true);
        setHashedOutput("");

        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(inputText);
            let hashBuffer: ArrayBuffer;

            if (algorithm === "MD5") {
                const hash = simpleMd5(inputText);
                setHashedOutput(hash);
            } else {
                hashBuffer = await crypto.subtle.digest(algorithm, data);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                setHashedOutput(hashHex);
            }
            
            await logToolUsage();

        } catch (error) {
            console.error("Hashing error:", error);
            toast({
                variant: "destructive",
                title: "Error generating hash",
                description: "An unexpected error occurred. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (!hashedOutput) return;
        navigator.clipboard.writeText(hashedOutput);
        toast({
            title: "Copied to clipboard!",
        });
    };

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline">Generate a Hash</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid w-full gap-2">
                    <Label htmlFor="input-text">Text to Hash</Label>
                    <Textarea
                        id="input-text"
                        placeholder="Enter your text here..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        rows={5}
                    />
                </div>
                <div className="grid w-full max-w-sm items-center gap-2">
                    <Label htmlFor="algorithm">Algorithm</Label>
                    <Select value={algorithm} onValueChange={(value) => setAlgorithm(value as HashAlgorithm)}>
                        <SelectTrigger id="algorithm">
                            <SelectValue placeholder="Select algorithm" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="SHA-256">SHA-256</SelectItem>
                            <SelectItem value="SHA-512">SHA-512</SelectItem>
                            <SelectItem value="MD5">MD5 (for educational purposes)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                
                <Button onClick={generateHash} disabled={isLoading} className="w-full sm:w-auto">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Generate Hash
                </Button>

                {hashedOutput && (
                    <div className="space-y-2">
                        <Label htmlFor="output-hash">Resulting Hash</Label>
                        <div className="relative">
                            <Input
                                id="output-hash"
                                readOnly
                                value={hashedOutput}
                                className="font-mono pr-10"
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground"
                                onClick={copyToClipboard}
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
