import { z } from "zod";

export const medicationEnrichmentSchema = z
  .object({
    description: z.string().min(80).max(700),
    clinicalContexts: z.array(z.string().min(8).max(180)).min(3).max(6),
    patientReports: z.array(z.string().min(8).max(180)).min(4).max(7),
    sessionObservations: z.array(z.string().min(12).max(240)).min(4).max(7),
    confoundingEffects: z.array(z.string().min(12).max(280)).min(4).max(7),
    usefulQuestions: z.array(z.string().min(8).max(220)).min(5).max(8),
    coordinationNotes: z.array(z.string().min(12).max(260)).min(3).max(6),
    attentionSignals: z.array(z.string().min(12).max(260)).min(3).max(6),
    clinicalPhrase: z.string().min(20).max(180),
  })
  .strict();

export type MedicationEnrichmentOutput = z.infer<
  typeof medicationEnrichmentSchema
>;
