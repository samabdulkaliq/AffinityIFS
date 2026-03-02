'use server';
/**
 * @fileOverview An AI assistant that helps cleaners troubleshoot issues on-site.
 *
 * - cleanerHelpAssistant - A function that handles cleaner support queries.
 * - CleanerHelpInput - The input type for the cleanerHelpAssistant function.
 * - CleanerHelpOutput - The return type for the cleanerHelpAssistant function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CleanerHelpInputSchema = z.object({
  cleanerName: z.string(),
  issueDescription: z.string().describe("What the cleaner is reporting (e.g., 'I can't find the key', 'The GPS is not working')"),
  currentLocationName: z.string().optional(),
  shiftStatus: z.string().optional(),
});
export type CleanerHelpInput = z.infer<typeof CleanerHelpInputSchema>;

const CleanerHelpOutputSchema = z.object({
  advice: z.string().describe("Direct, helpful advice for the cleaner."),
  suggestedAction: z.enum(['Contact Admin', 'Submit Manual Report', 'Retry Location', 'Wait 5 Mins', 'Proceed with Work']),
  empathyStatement: z.string().describe("A short friendly opening to reassure the worker."),
});
export type CleanerHelpOutput = z.infer<typeof CleanerHelpOutputSchema>;

const cleanerHelpPrompt = ai.definePrompt({
  name: 'cleanerHelpPrompt',
  input: { schema: CleanerHelpInputSchema },
  output: { schema: CleanerHelpOutputSchema },
  prompt: `You are a helpful AI supervisor for Affinity, a cleaning platform. 
A cleaner named {{{cleanerName}}} is having an issue: "{{{issueDescription}}}".
Current Location: {{{currentLocationName}}}
Shift Status: {{{shiftStatus}}}

Provide empathetic and practical advice. 
If it sounds like a technical GPS issue, suggest "Retry Location" or "Submit Manual Report".
If they can't access a site, suggest "Contact Admin".
Keep it professional but supportive.`,
});

const cleanerHelpFlow = ai.defineFlow(
  {
    name: 'cleanerHelpFlow',
    inputSchema: CleanerHelpInputSchema,
    outputSchema: CleanerHelpOutputSchema,
  },
  async (input) => {
    const { output } = await cleanerHelpPrompt(input);
    return output!;
  }
);

export async function cleanerHelpAssistant(input: CleanerHelpInput): Promise<CleanerHelpOutput> {
  return cleanerHelpFlow(input);
}
