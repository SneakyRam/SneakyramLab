"use client";

import { useState } from "react";
import { generateHash, simpleMd5 } from "@/lib/security/hash";
import { useAuth } from "@/hooks/use-auth";
import { logHashUsage } from "@/lib/firestore/hashHistory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Copy, Loader2 } from "lucide-react";
import AlgorithmInfo from "./AlgorithmInfo";

type HashAlgorithm = "SHA-256" | "SHA-512" | "MD5";

export default function HashWidget() {
  const [inputText, setInputText] = useState("");
  const [hashedOutput, setHashedOutput] = useState("");
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>("SHA-256");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleGenerate = async () => {
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
      let hashHex: string;
      if (algorithm === "MD5") {
        hashHex = simpleMd5(inputText);
      } else {
        hashHex = await generateHash(inputText, algorithm);
      }
      setHashedOutput(hashHex);
      
      if (user) {
        logHashUsage(user.uid, algorithm);
      }

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
        
        <AlgorithmInfo algo={algorithm} onValueChange={(val) => setAlgorithm(val as HashAlgorithm)} />
        
        <Button onClick={handleGenerate} disabled={isLoading} className="w-full sm:w-auto">
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
