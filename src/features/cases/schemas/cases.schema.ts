import { z } from "zod";

export const createCaseSchema = z.object({
  initials: z
    .string()
    .min(1, "Iniciais são obrigatórias")
    .max(5, "Máximo de 5 caracteres")
    .transform((val) => val.toUpperCase()),
  birthYear: z
    .number()
    .int()
    .min(1900, "Ano inválido")
    .max(new Date().getFullYear(), "Ano não pode ser no futuro")
    .optional(),
});

export const linkMedicationSchema = z.object({
  caseId: z.string().uuid("ID do caso inválido"),
  medicationId: z.string().uuid("ID do medicamento inválido"),
  isCurrent: z.boolean().default(true),
});

export type CreateCaseInput = z.infer<typeof createCaseSchema>;
export type LinkMedicationInput = z.infer<typeof linkMedicationSchema>;
