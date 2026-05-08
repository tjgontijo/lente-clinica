import type { createSessionSchema, caseIdSchema } from "./schemas/sessions.schema";
import type { z } from "zod";

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
