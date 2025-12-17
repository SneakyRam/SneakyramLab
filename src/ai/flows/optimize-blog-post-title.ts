'use server';

/**
 * @fileOverview An AI agent for optimizing blog post titles.
 *
 * - optimizeBlogPostTitle - A function that optimizes a blog post title.
 * - OptimizeBlogPostTitleInput - The input type for the optimizeBlogPostTitle function.
 * - OptimizeBlogPostTitleOutput - The return type for the optimizeBlogPostTitle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeBlogPostTitleInputSchema = z.object({
  title: z.string().describe('The current title of the blog post.'),
  keywords: z.string().describe('Comma separated keywords related to the blog post.'),
});
export type OptimizeBlogPostTitleInput = z.infer<
  typeof OptimizeBlogPostTitleInputSchema
>;

const OptimizeBlogPostTitleOutputSchema = z.object({
  optimizedTitle: z
    .string()
    .describe('An optimized title for the blog post that is SEO friendly.'),
  metaDescription: z
    .string()
    .describe('A suggested meta description for the blog post.'),
});
export type OptimizeBlogPostTitleOutput = z.infer<
  typeof OptimizeBlogPostTitleOutputSchema
>;

export async function optimizeBlogPostTitle(
  input: OptimizeBlogPostTitleInput
): Promise<OptimizeBlogPostTitleOutput> {
  return optimizeBlogPostTitleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeBlogPostTitlePrompt',
  input: {schema: OptimizeBlogPostTitleInputSchema},
  output: {schema: OptimizeBlogPostTitleOutputSchema},
  prompt: `You are an SEO expert tasked with optimizing blog post titles to improve search engine rankings and attract more readers.

  Given the current title and keywords, suggest an optimized title and a meta description for the blog post.

  Current Title: {{{title}}}
  Keywords: {{{keywords}}}

  Optimized Title: (An optimized title for the blog post)
  Meta Description: (A suggested meta description for the blog post)
  `,
});

const optimizeBlogPostTitleFlow = ai.defineFlow(
  {
    name: 'optimizeBlogPostTitleFlow',
    inputSchema: OptimizeBlogPostTitleInputSchema,
    outputSchema: OptimizeBlogPostTitleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
