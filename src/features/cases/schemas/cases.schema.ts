import { z } from "zod";

export const createCaseSchema = z.object({
  firstName: z
    .string()
    .min(2, "Primeiro nome é obrigatório")
    .max(50, "Máximo de 50 caracteres")
    .transform((val) => val.charAt(0).toUpperCase() + val.slice(1)),
  phoneSuffix: z
    .string()
    .regex(/^\d{4}$/, "Devem ser exatamente os últimos 4 dígitos")
    .optional(),
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
