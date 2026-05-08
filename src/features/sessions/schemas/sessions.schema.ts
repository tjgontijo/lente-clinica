import { z } from "zod";

export const createSessionSchema = z.object({
  caseId: z.string().uuid("ID do caso inválido"),
  date: z.coerce.date(),
  notes: z.string().optional(),
  symptomIds: z.array(z.string().uuid("ID do sintoma inválido")).default([]),
});

export const caseIdSchema = z.object({
  caseId: z.string().uuid("ID do caso inválido"),
});
