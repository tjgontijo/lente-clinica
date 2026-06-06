import { z } from "zod";

const boundedString = (min: number, max: number) =>
  z.string().min(min).max(max);

export const medicationEnrichmentSchema = z.object({
  description: boundedString(300, 3000),

  clinicalDomains: z
    .array(
      z.object({
        name: boundedString(1, 200),
        content: z.string(),
      }),
    )
    .min(1)
    .max(10),

  sessionDiscriminationQuestions: z.array(z.string()).min(2).max(10),

  communicationScenarios: z.array(z.string()).min(2).max(10),

  attentionSignals: z
    .array(
      z.object({
        level: z.enum(["amarelo", "vermelho"]),
        signal: z.string(),
        action: z.string(),
      }),
    )
    .min(2)
    .max(10),

  clinicalPhrase: boundedString(1, 400),
});

export type MedicationEnrichment = z.infer<typeof medicationEnrichmentSchema>;
