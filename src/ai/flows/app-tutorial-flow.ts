'use server';
/**
 * @fileOverview An AI assistant that explains how to use the Affinity app to cleaners.
 * 
 * - appTutorialAssistant - A function that answers questions about using the app.
 * - AppTutorialInput - The input type for the appTutorialAssistant function.
 * - AppTutorialOutput - The return type for the appTutorialAssistant function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AppTutorialInputSchema = z.object({
  cleanerName: z.string(),
  question: z.string().describe("What the cleaner wants to know about the app."),
});
export type AppTutorialInput = z.infer<typeof AppTutorialInputSchema>;

const AppTutorialOutputSchema = z.object({
  answer: z.string().describe("A very simple, friendly explanation using zero technical jargon."),
  actionStep: z.string().describe("A simple one-sentence instruction on what button to press next."),
  emoji: z.string().describe("A single helpful emoji."),
});
export type AppTutorialOutput = z.infer<typeof AppTutorialOutputSchema>;

const appTutorialPrompt = ai.definePrompt({
  name: 'appTutorialPrompt',
  input: { schema: AppTutorialInputSchema },
  output: { schema: AppTutorialOutputSchema },
  prompt: `You are a patient, friendly guide for the Affinity app. 
The user is a cleaner named {{{cleanerName}}}. They are likely older and not tech-savvy.
They asked: "{{{question}}}"

Explain how to use the app in the simplest terms possible. 
- Do not use words like 'interface', 'module', 'navigation', or 'geofence'.
- Instead of 'Clock-in', use 'Start Work'.
- Instead of 'Inventory', use 'Supplies'.
- Instead of 'Notifications', use 'Messages'.
- Instead of 'Log', use 'Photos'.

Keep your answer to 2 short sentences. Focus on being helpful and kind.`,
});

const appTutorialFlow = ai.defineFlow(
  {
    name: 'appTutorialFlow',
    inputSchema: AppTutorialInputSchema,
    outputSchema: AppTutorialOutputSchema,
  },
  async (input) => {
    const { output } = await appTutorialPrompt(input);
    return output!;
  }
);

export async function appTutorialAssistant(input: AppTutorialInput): Promise<AppTutorialOutput> {
  return appTutorialFlow(input);
}
