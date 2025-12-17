import { z } from 'zod';

export const GlobalAssistantInputSchema = z.object({
  userQuery: z.string().describe("The user's question or prompt."),
  pageContext: z
    .string()
    .describe(
      'The current page the user is on (e.g., "Home Page", "Blog Post", "Dashboard").'
    ),
  contextualData: z
    .string()
    .optional()
    .describe(
      'Optional, specific data from the page, like a blog post title or tool name.'
    ),
});
export type GlobalAssistantInput = z.infer<typeof GlobalAssistantInputSchema>;

export const GlobalAssistantOutputSchema = z.object({
  response: z
    .string()
    .describe(
      'The AI-generated, helpful, and context-aware response to the user.'
    ),
});
export type GlobalAssistantOutput = z.infer<
  typeof GlobalAssistantOutputSchema
>;
