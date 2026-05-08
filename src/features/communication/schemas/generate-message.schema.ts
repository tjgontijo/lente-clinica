import { z } from "zod";

export const generateMessageSchema = z.object({
  sessionId: z.string().uuid("ID da sessão inválido"),
  scenarioId: z.string(),
  format: z.enum(["SHORT", "MEDIUM", "FORMAL"]),
});

export type GenerateMessageInput = z.infer<typeof generateMessageSchema>;
