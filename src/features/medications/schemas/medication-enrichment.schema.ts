import { z } from "zod";

const boundedString = (min: number, max: number) =>
  z.string().min(min).max(max);

export const medicationEnrichmentSchema = z.object({
  description: boundedString(80, 700),

  clinicalContexts: z
    .array(boundedString(1, 180))
    .min(3)
    .max(6),

  patientReports: z
    .array(boundedString(1, 180))
    .min(4)
    .max(7),

  careObservations: z
    .array(boundedString(1, 240))
    .min(4)
    .max(7),

  clinicalConfounders: z
    .array(boundedString(1, 280))
    .min(4)
    .max(7),

  usefulQuestions: z
    .array(boundedString(1, 220))
    .min(5)
    .max(8),

  coordinationNotes: z
    .array(boundedString(1, 260))
    .min(3)
    .max(6),

  attentionSignals: z
    .array(boundedString(1, 260))
    .min(3)
    .max(6),

  clinicalPhrase: boundedString(1, 180),
});

export type MedicationEnrichment = z.infer<typeof medicationEnrichmentSchema>;
