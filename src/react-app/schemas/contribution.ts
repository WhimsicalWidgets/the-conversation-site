import { z } from "zod";

export const TONE_VALUES = ["neutral", "positive", "negative", "curious", "assertive"] as const;

export const contributionSchema = z.object({
  content: z
    .string()
    .min(1, "Contribution cannot be empty")
    .max(5000, "Contribution cannot exceed 5000 characters"),
  tone: z.enum(TONE_VALUES).nullable(),
});

export type ContributionFormData = z.infer<typeof contributionSchema>;
