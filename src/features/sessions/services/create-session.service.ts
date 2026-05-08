import "server-only";
import { findCaseByIdRepository } from "@/features/cases/repositories/find-case-by-id.repository";
import { createSessionRepository } from "../repositories/create-session.repository";
import { createSessionSchema } from "../schemas/sessions.schema";

export async function createSessionService(userId: string, input: unknown) {
  const data = createSessionSchema.parse(input);

  // Segurança: garantir que o caso pertence ao usuário
  const existingCase = await findCaseByIdRepository(data.caseId);
  if (!existingCase || existingCase.userId !== userId) {
    throw new Error("Caso não encontrado ou acesso negado.");
  }

  return createSessionRepository(data);
}
