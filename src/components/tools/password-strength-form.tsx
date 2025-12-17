"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth, useFirestore } from "@/firebase";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";


type PasswordStrength = {
  score: number;
  feedback: string;
  color: string;
};

export function PasswordStrengthForm() {
    const [password, setPassword] = useState("");
    const [strength, setStrength] = useState<PasswordStrength>({ score: 0, feedback: "Enter a password to test", color: "bg-gray-400" });
    const { user } = useAuth();
    const firestore = useFirestore();

    const logToolUsage = async () => {
        if (!user || !firestore) return;

        const logData = {
            userId: user.uid,
            toolName: "Password Strength Checker",
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
    
    // This is a simple client-side strength check. A real-world app would use a more robust library like zxcvbn.
    const checkStrength = (pass: string) => {
        let score = 0;
        let feedback = "";
        let color = "bg-red-500";
        const weaknesses: string[] = [];

        if (pass.length === 0) {
            feedback = "Enter a password to test";
            score = 0;
            color = "bg-gray-400"
        } else {
            if (pass.length < 8) weaknesses.push("is too short (less than 8 characters)");
            if (!/[a-z]/.test(pass)) weaknesses.push("is missing lowercase letters");
            if (!/[A-Z]/.test(pass)) weaknesses.push("is missing uppercase letters");
            if (!/\d]/.test(pass)) weaknesses.push("is missing numbers");
            if (!/[^A-Za-z0-9]/.test(pass)) weaknesses.push("is missing special characters");

            const strengthPoints = 5 - weaknesses.length;
            score = strengthPoints * 20;

            if (strengthPoints <= 2) {
                feedback = "Weak. " + weaknesses.join(", ");
                color = "bg-red-500";
            } else if (strengthPoints === 3) {
                feedback = "Moderate. " + weaknesses.join(", ");
                color = "bg-yellow-500";
            } else if (strengthPoints === 4) {
                feedback = "Strong. " + (weaknesses.length > 0 ? weaknesses.join(', ') : '');
                color = "bg-green-500";
            } else {
                feedback = "Very Strong! This is a great password.";
                color = "bg-emerald-500";
            }
        }


        setStrength({ score, feedback, color });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        checkStrength(newPassword);
        if (newPassword.length > 0) {
            logToolUsage();
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
            </CardContent>
        </Card>
    );
}
