"use client";

import { useState } from "react";
import { evaluatePassword } from "@/lib/security/passwordEvaluator";
import { estimateCrackTime } from "@/lib/security/crackTime";
import StrengthBar from "./StrengthBar";
import PasswordGenerator from "./PasswordGenerator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { savePasswordCheck } from "@/lib/firestore/passwordHistory";
import { useAuth } from "@/hooks/use-auth";

export default function PasswordWidget() {
  const [password, setPassword] = useState("");
  const { user } = useAuth();

  const result = password ? evaluatePassword(password) : null;

  // When password changes, log it for the user if they are signed in.
  // In a real app, you might want to debounce this.
  if (result && user) {
    savePasswordCheck(user.uid, result.strength, result.entropy);
  }

  return (
    <Card className="w-full max-w-xl mx-auto shadow-xl">
        <CardHeader>
            <CardTitle className="font-headline text-2xl">Check your Password</CardTitle>
            <CardDescription>
                Enter a password to see its strength, estimated time to crack, and tips for improvement.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col sm:flex-row gap-2">
                <Input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Test your password"
                    className="flex-grow text-lg h-12"
                />
            </div>
             <div className="mt-4">
                <PasswordGenerator onGenerate={setPassword} />
            </div>

            <div className={`mt-4 space-y-4 transition-opacity duration-300 ${result ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                {result && (
                <>
                    <StrengthBar percent={result.percent} />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div className="flex flex-col">
                            <span className="text-muted-foreground">Strength</span>
                            <span className="font-semibold text-lg">{result.strength}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-muted-foreground">Entropy</span>
                            <span className="font-semibold text-lg">{result.entropy} bits</span>
                        </div>
                         <div className="flex flex-col">
                            <span className="text-muted-foreground">Est. crack time</span>
                            <span className="font-semibold text-lg">{estimateCrackTime(result.entropy)}</span>
                        </div>
                    </div>
                    

                    {result.missing.length > 0 && (
                        <div>
                            <p className="font-medium mb-2">How to Improve:</p>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                                {result.missing.map((m, i) => <li key={i}>Add {m}</li>)}
                            </ul>
                        </div>
                    )}
                </>
                )}
            </div>
        </CardContent>
    </Card>
  );
}
