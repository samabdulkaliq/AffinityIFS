'use server';
/**
 * @fileOverview An AI flow that generates professional document request messages.
 * 
 * - generateDocRequest - A function that generates push and email content.
 * - DocRequestInput - The input type for the generator.
 * - DocRequestOutput - The return type containing push and email copy.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DocRequestInputSchema = z.object({
  workerName: z.string(),
  docType: z.string(),
  expiryDate: z.string().optional(),
  dueDate: z.string(),
  managerName: z.string(),
  tone: z.enum(['Friendly', 'Professional', 'Urgent']),
  optionalNote: z.string().optional(),
});
export type DocRequestInput = z.infer<typeof DocRequestInputSchema>;

const DocRequestOutputSchema = z.object({
  pushTitle: z.string(),
  pushBody: z.string(),
  emailSubject: z.string(),
  emailBody: z.string(),
});
export type DocRequestOutput = z.infer<typeof DocRequestOutputSchema>;

const docRequestPrompt = ai.definePrompt({
  name: 'docRequestPrompt',
  input: { schema: DocRequestInputSchema },
  output: { schema: DocRequestOutputSchema },
  prompt: `You are an expert HR assistant for Affinity, a facilities management company. 
Your goal is to generate a document update request for a Team Member named {{{workerName}}}.

The document needed is: {{{docType}}}
{{#if expiryDate}}Current status: Expired on {{{expiryDate}}}{{/if}}
Deadline for upload: {{{dueDate}}}
Manager requesting: {{{managerName}}}
Tone: {{{tone}}}
{{#if optionalNote}}Additional Note: "{{{optionalNote}}}"{{/if}}

Please generate:
1. A concise push notification (Title + Body).
2. A professional email (Subject + Body).

Guidelines:
- If tone is Friendly: Use warm, supportive language.
- If tone is Professional: Use standard business communication.
- If tone is Urgent: Emphasize the immediate deadline and compliance importance.
- Do NOT use jargon. 
- Refer to the user as a "Team Member".`,
});

const docRequestFlow = ai.defineFlow(
  {
    name: 'docRequestFlow',
    inputSchema: DocRequestInputSchema,
    outputSchema: DocRequestOutputSchema,
  },
  async (input) => {
    const { output } = await docRequestPrompt(input);
    return output!;
  }
);

export async function generateDocRequest(input: DocRequestInput): Promise<DocRequestOutput> {
  return docRequestFlow(input);
}
