import "server-only";
import { findCaseByIdRepository } from "@/features/cases/repositories/find-case-by-id.repository";
import { listSessionsByCaseRepository } from "../repositories/list-sessions-by-case.repository";
import { caseIdSchema } from "../schemas/sessions.schema";

export async function listSessionsService(userId: string, input: unknown) {
  const { caseId } = caseIdSchema.parse({ caseId: input });

  // Segurança
  const existingCase = await findCaseByIdRepository(caseId);
  if (!existingCase || existingCase.userId !== userId) {
    throw new Error("Caso não encontrado ou acesso negado.");
  }

  return listSessionsByCaseRepository(caseId);
}
