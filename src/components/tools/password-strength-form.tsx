
"use client";

import { useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { explainPasswordWeakness } from "@/ai/flows/explain-password-weakness";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PasswordStrength = {
  score: number;
  feedback: string;
  color: string;
};

const passwordWeaknessAction = async (prevState: any, formData: FormData) => {
    const password = formData.get("password") as string;
    const weaknessExplanation = formData.get("weaknessExplanation") as string;
  
    if (!password || !weaknessExplanation) {
      return { explanation: null, message: null };
    }
  
    try {
      const result = await explainPasswordWeakness({ password, weaknessExplanation });
      return { explanation: result.explanation, message: null };
    } catch (e) {
      return { explanation: null, message: "Failed to get explanation from AI." };
    }
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full sm:w-auto bg-accent hover:bg-accent/90">
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
            Explain Weakness with AI
        </Button>
    );
}

export function PasswordStrengthForm() {
    const [password, setPassword] = useState("");
    const [strength, setStrength] = useState<PasswordStrength>({ score: 0, feedback: "Enter a password to test", color: "bg-gray-400" });
    const [state, formAction] = useActionState(passwordWeaknessAction, { explanation: null, message: null });
    
    // This is a simple client-side strength check. A real-world app would use a more robust library like zxcvbn.
    const checkStrength = (pass: string) => {
        let score = 0;
        let feedback = "";
        let color = "bg-red-500";
        const weaknesses: string[] = [];

        if (pass.length < 8) weaknesses.push("is too short (less than 8 characters)");
        if (!/[a-z]/.test(pass)) weaknesses.push("is missing lowercase letters");
        if (!/[A-Z]/.test(pass)) weaknesses.push("is missing uppercase letters");
        if (!/\d/.test(pass)) weaknesses.push("is missing numbers");
        if (!/[^A-Za-z0-9]/.test(pass)) weaknesses.push("is missing special characters");

        const strengthPoints = 5 - weaknesses.length;
        score = strengthPoints * 20;

        if (pass.length === 0) {
            feedback = "Enter a password to test";
            score = 0;
            color = "bg-gray-400"
        } else if (strengthPoints <= 2) {
            feedback = "Weak. " + weaknesses.join(", ");
            color = "bg-red-500";
        } else if (strengthPoints === 3) {
            feedback = "Moderate. " + weaknesses.join(", ");
            color = "bg-yellow-500";
        } else if (strengthPoints === 4) {
            feedback = "Strong. " + weaknesses.join(", ");
            color = "bg-green-500";
        } else {
            feedback = "Very Strong! This is a great password.";
            color = "bg-emerald-500";
        }

        setStrength({ score, feedback, color });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        checkStrength(newPassword);
        // Clear previous AI explanation when password changes
        if(state.explanation || state.message) {
            // A bit of a hack to reset the form state by calling the action with empty form data
            const emptyFormData = new FormData();
            emptyFormData.append("password", "");
            emptyFormData.append("weaknessExplanation", "");
            formAction(emptyFormData);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline">Test Your Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Input
                        type="text"
                        placeholder="Enter your password"
                        value={password}
                        onChange={handlePasswordChange}
                        className="text-lg"
                    />
                    <div className="h-3 w-full rounded-full bg-muted">
                        <div
                            className={`h-3 rounded-full transition-all duration-300 ${strength.color}`}
                            style={{ width: `${strength.score}%` }}
                        />
                    </div>
                    <p className="text-sm text-muted-foreground">{strength.feedback}</p>
                </div>
                
                {password.length > 0 && strength.score < 100 && (
                    <form action={formAction} className="space-y-4">
                        <input type="hidden" name="password" value={password} />
                        <input type="hidden" name="weaknessExplanation" value={strength.feedback} />
                        <SubmitButton />
                    </form>
                )}

                {state?.explanation && (
                    <Alert>
                        <Lightbulb className="h-4 w-4" />
                        <AlertTitle>AI-Powered Analysis</AlertTitle>
                        <AlertDescription className="prose prose-sm dark:prose-invert">
                           <p>{state.explanation}</p>
                        </AlertDescription>
                    </Alert>
                )}
                 {state?.message && (
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{state.message}</AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}
