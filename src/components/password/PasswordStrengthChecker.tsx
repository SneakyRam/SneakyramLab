"use client";

import { useState } from "react";
import { evaluatePassword } from "@/lib/password/evaluator";
import { estimateCrackTime } from "@/lib/password/crackTime";
import { generateSuggestions } from "@/lib/password/suggestions";
import { passwordTutorMessage } from "@/ai/tutor/passwordTutor";
import PasswordExamples from "./PasswordExamples";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Progress } from "../ui/progress";

export default function PasswordStrengthChecker() {
  const [password, setPassword] = useState("");

  const result = password ? evaluatePassword(password) : null;
  const crackTime = password ? estimateCrackTime(password) : null;
  const strengthColor = 
    result?.percentage === 100 ? 'bg-emerald-500' :
    result?.percentage === 80 ? 'bg-green-500' :
    result?.percentage === 60 ? 'bg-yellow-500' :
    result?.percentage === 40 ? 'bg-orange-500' :
    'bg-red-500';


  return (
    <Card className="w-full max-w-xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Password Strength Checker</CardTitle>
        <CardDescription>
          Analyze how secure your passwords are. We don’t store anything you type.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Input
            type="text"
            placeholder="Start typing a password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-lg h-12"
        />

        <div className={`mt-4 space-y-4 transition-opacity duration-500 ${password ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
            {result && (
            <>
                {/* Progress bar */}
                <Progress value={result.percentage} className={`h-2 [&>div]:${strengthColor}`} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex flex-col">
                        <span className="text-muted-foreground">Strength</span>
                        <span className="font-semibold text-lg text-foreground">{result.strength}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-muted-foreground">Est. time to crack</span>
                        <span className="font-semibold text-lg text-foreground">{crackTime}</span>
                    </div>
                </div>

                {result.missing.length > 0 && (
                    <div className="text-sm">
                        <p className="font-medium text-foreground">Suggestions:</p>
                        <ul className="list-disc ml-5 mt-2 space-y-1 text-muted-foreground">
                        {generateSuggestions(result.missing).map((s, i) => (
                            <li key={i}>{s}</li>
                        ))}
                        </ul>
                    </div>
                )}

                <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                    <p className="text-sm font-semibold text-accent">
                        {passwordTutorMessage(result.strength)}
                    </p>
                </div>

                <PasswordExamples />
            </>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
