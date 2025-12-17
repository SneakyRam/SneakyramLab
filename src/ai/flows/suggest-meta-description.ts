'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting a meta description for a blog post based on its content.
 *
 * The flow takes the blog post content as input and returns a suggested meta description.
 *
 * @exports {
 *   suggestMetaDescription: (input: string) => Promise<string>;
 *   SuggestMetaDescriptionInput: string;
 *   SuggestMetaDescriptionOutput: string;
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the flow
const SuggestMetaDescriptionInputSchema = z.string().describe('The content of the blog post.');
export type SuggestMetaDescriptionInput = z.infer<typeof SuggestMetaDescriptionInputSchema>;

// Define the output schema for the flow
const SuggestMetaDescriptionOutputSchema = z.string().describe('The suggested meta description for the blog post.');
export type SuggestMetaDescriptionOutput = z.infer<typeof SuggestMetaDescriptionOutputSchema>;

/**
 * Wrapper function to suggest a meta description for a blog post.
 * @param input The content of the blog post.
 * @returns A promise that resolves to the suggested meta description.
 */
export async function suggestMetaDescription(input: SuggestMetaDescriptionInput): Promise<SuggestMetaDescriptionOutput> {
  return suggestMetaDescriptionFlow(input);
}

// Define the prompt for suggesting a meta description
const suggestMetaDescriptionPrompt = ai.definePrompt({
  name: 'suggestMetaDescriptionPrompt',
  input: {schema: SuggestMetaDescriptionInputSchema},
  output: {schema: SuggestMetaDescriptionOutputSchema},
  prompt: `You are an expert in creating compelling and SEO-optimized meta descriptions for blog posts.
  Based on the content of the blog post provided, generate a meta description that is concise, engaging, and accurately reflects the post's content.
  The meta description should be no more than 160 characters.
  
  Blog Post Content: {{{input}}}
  
  Suggested Meta Description:`,
});

// Define the Genkit flow for suggesting a meta description
const suggestMetaDescriptionFlow = ai.defineFlow(
  {
    name: 'suggestMetaDescriptionFlow',
    inputSchema: SuggestMetaDescriptionInputSchema,
    outputSchema: SuggestMetaDescriptionOutputSchema,
  },
  async input => {
    const {text} = await suggestMetaDescriptionPrompt(input);
    return text!;
  }
);
