import type { z } from "zod";
import type {
  caseIdSchema,
  createSessionSchema,
} from "./schemas/sessions.schema";

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type CaseIdInput = z.infer<typeof caseIdSchema>;

export interface SessionWithDetails {
  id: string;
  caseId: string;
  date: Date;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}
