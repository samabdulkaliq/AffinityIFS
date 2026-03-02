'use server';
/**
 * @fileOverview An AI assistant that analyzes time review requests for administrators.
 *
 * - intelligentTimeReviewAssistant - A function that handles the intelligent time review process.
 * - TimeReviewAssistantInput - The input type for the intelligentTimeReviewAssistant function.
 * - TimeReviewAssistantOutput - The return type for the intelligentTimeReviewAssistant function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TimeReviewAssistantInputSchema = z.object({
  requestId: z.string().describe("Unique ID of the time review request."),
  cleanerName: z.string().describe("Name of the cleaner who submitted the request."),
  workerType: z.enum(['EMPLOYEE', 'CONTRACT']).describe("Type of worker: 'EMPLOYEE' or 'CONTRACT'."),
  requestReason: z.string().describe("The reason for the time review request provided by the cleaner."),
  requestNote: z.string().describe("Additional notes from the cleaner regarding the request."),
  requestCreatedAt: z.string().datetime().describe("Timestamp when the request was created (ISO format)."),
  shiftId: z.string().describe("ID of the associated shift."),
  scheduledStart: z.string().datetime().describe("Scheduled start time of the shift (ISO format)."),
  scheduledEnd: z.string().datetime().describe("Scheduled end time of the shift (ISO format)."),
  siteName: z.string().describe("Name of the job site."),
  existingTimeEvents: z.array(
    z.object({
      type: z.enum(['CLOCK_IN', 'CLOCK_OUT', 'BREAK_START', 'BREAK_END', 'ADJUSTMENT']),
      timestamp: z.string().datetime().describe("Timestamp of the event (ISO format)."),
      source: z.enum(['AUTO', 'MANUAL', 'ADMIN']).describe("Source of the event."),
      notes: z.string().optional().describe("Any notes associated with the event."),
    })
  ).describe("A timeline of existing time events for this shift."),
  ontarioBreakRuleEnabled: z.boolean().describe("Whether the Ontario break rule applies to this shift (30 min unpaid break after 5 hours)."),
});
export type TimeReviewAssistantInput = z.infer<typeof TimeReviewAssistantInputSchema>;

const TimeReviewAssistantOutputSchema = z.object({
  analysisSummary: z.string().describe("A concise summary of the request, relevant facts, and the AI's findings."),
  identifiedDiscrepancies: z.array(z.string()).describe("List of discrepancies or unusual patterns identified, e.g., 'Missing CLOCK_OUT event', 'Clock-in is X minutes late'."),
  suggestedCategory: z.enum([
    'Missed Clock-In',
    'Missed Clock-Out',
    'Late Arrival',
    'Early Departure',
    'Break Correction',
    'Overtime Request',
    'Dispute',
    'GPS Issue',
    'Other'
  ]).describe("Categorization of the request to help with filtering and routing."),
  suggestedResolution: z.enum(['Approve', 'Reject', 'Adjust Time', 'Request More Info', 'Escalate']).describe("The AI's recommended action for the administrator."),
  suggestedAdjustment: z.object({
    eventType: z.enum(['CLOCK_IN', 'CLOCK_OUT', 'BREAK_START', 'BREAK_END']),
    suggestedTimestamp: z.string().datetime().describe("The ISO formatted timestamp for the suggested adjustment."),
    reason: z.string().describe("Reasoning for the suggested time adjustment."),
  }).optional().describe("If 'Adjust Time' is suggested, details of the proposed adjustment."),
  adminGuidance: z.string().describe("Specific guidance or questions for the administrator to consider before making a decision."),
  confidenceScore: z.number().min(0).max(1).describe("A score (0-1) indicating the AI's confidence in its suggestions. Higher is better."),
});
export type TimeReviewAssistantOutput = z.infer<typeof TimeReviewAssistantOutputSchema>;

const intelligentTimeReviewAssistantPrompt = ai.definePrompt({
  name: 'intelligentTimeReviewAssistantPrompt',
  input: { schema: TimeReviewAssistantInputSchema },
  output: { schema: TimeReviewAssistantOutputSchema },
  prompt: `You are an intelligent time review assistant for Affinity, a cleaning company workforce platform. Your goal is to help administrators streamline the approval process for cleaner time review requests by analyzing the provided data, highlighting discrepancies, and suggesting resolutions or categorizations.\n\nAnalyze the cleaner's time review request, their notes, the scheduled shift times, and the existing time events. Pay close attention to timestamps and the Ontario break rule (if enabled).\n\n**Cleaner Information:**\nName: {{{cleanerName}}}\nWorker Type: {{{workerType}}}\n\n**Request Details:**\nRequest ID: {{{requestId}}}\nReason for Request: {{{requestReason}}}\nCleaner's Note: {{{requestNote}}}\nRequest Created At: {{{requestCreatedAt}}}\n\n**Shift Details:**\nShift ID: {{{shiftId}}}\nSite Name: {{{siteName}}}\nScheduled Start: {{{scheduledStart}}}\nScheduled End: {{{scheduledEnd}}}\nOntario Break Rule Applied (30 min unpaid break after 5 hours): {{{ontarioBreakRuleEnabled}}}\n\n**Existing Time Events for this Shift (chronological order):**\n{{#if existingTimeEvents}}\n{{#each existingTimeEvents}}\n- Type: {{this.type}}, Timestamp: {{this.timestamp}}, Source: {{this.source}}{{#if this.notes}}, Notes: "{{this.notes}}"{{/if}}\n{{/each}}\n{{else}}\nNo existing time events found for this shift.\n{{/if}}\n\nBased on the above information, perform the following tasks:\n1.  **Summarize the situation**: Provide a brief summary of the request and the initial findings.\n2.  **Identify Discrepancies**: List any inconsistencies, missing events (e.g., clock-out), late/early arrivals/departures compared to the schedule, or potential issues related to the Ontario break rule.\n3.  **Categorize the Request**: Assign one of the following categories: 'Missed Clock-In', 'Missed Clock-Out', 'Late Arrival', 'Early Departure', 'Break Correction', 'Overtime Request', 'Dispute', 'GPS Issue', 'Other'.\n4.  **Suggest a Resolution**: Recommend one of the following actions: 'Approve', 'Reject', 'Adjust Time', 'Request More Info', 'Escalate'.\n5.  **Suggest Adjustment (if applicable)**: If you suggest 'Adjust Time', provide the \`eventType\`, \`suggestedTimestamp\` (in ISO format), and a \`reason\` for the adjustment. Ensure the suggested timestamp is reasonable and in the correct format.\n6.  **Provide Admin Guidance**: Offer specific advice or questions for the administrator to consider before making a final decision.\n7.  **Confidence Score**: Assign a confidence score between 0 and 1 for your overall analysis and suggestions.\n\nReturn the output in a JSON object matching the \`TimeReviewAssistantOutputSchema\`.`,
});

const intelligentTimeReviewAssistantFlow = ai.defineFlow(
  {
    name: 'intelligentTimeReviewAssistantFlow',
    inputSchema: TimeReviewAssistantInputSchema,
    outputSchema: TimeReviewAssistantOutputSchema,
  },
  async (input) => {
    const { output } = await intelligentTimeReviewAssistantPrompt(input);
    return output!;
  }
);

export async function intelligentTimeReviewAssistant(
  input: TimeReviewAssistantInput
): Promise<TimeReviewAssistantOutput> {
  return intelligentTimeReviewAssistantFlow(input);
}
