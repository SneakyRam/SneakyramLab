'use server';

/**
 * @fileOverview Explains why a password is weak and provides suggestions for improvement.
 *
 * - explainPasswordWeakness - A function that explains password weakness and gives improvement tips.
 * - ExplainPasswordWeaknessInput - The input type for the explainPasswordWeakness function.
 * - ExplainPasswordWeaknessOutput - The return type for the explainPasswordWeakness function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainPasswordWeaknessInputSchema = z.object({
  password: z.string().describe('The password to analyze.'),
  weaknessExplanation: z.string().describe('The explanation of why the password is weak.'),
});
export type ExplainPasswordWeaknessInput = z.infer<typeof ExplainPasswordWeaknessInputSchema>;

const ExplainPasswordWeaknessOutputSchema = z.object({
  explanation: z.string().describe('The detailed explanation of the password weakness and suggestions for improvement.'),
});
export type ExplainPasswordWeaknessOutput = z.infer<typeof ExplainPasswordWeaknessOutputSchema>;

export async function explainPasswordWeakness(input: ExplainPasswordWeaknessInput): Promise<ExplainPasswordWeaknessOutput> {
  return explainPasswordWeaknessFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainPasswordWeaknessPrompt',
  input: {schema: ExplainPasswordWeaknessInputSchema},
  output: {schema: ExplainPasswordWeaknessOutputSchema},
  model: 'gemini-1.0-pro',
  prompt: `You are an AI expert in password security. You are given a password and an explanation of why it is weak.  Your task is to provide a detailed explanation to the user of the password's weakness and give suggestions for how to improve it.

Password: {{{password}}}
Weakness Explanation: {{{weaknessExplanation}}}

Explanation:
`,
});

const explainPasswordWeaknessFlow = ai.defineFlow(
  {
    name: 'explainPasswordWeaknessFlow',
    inputSchema: ExplainPasswordWeaknessInputSchema,
    outputSchema: ExplainPasswordWeaknessOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
