import "server-only";
import { findCaseByIdRepository } from "@/features/cases/repositories/find-case-by-id.repository";
import { getActiveAlertsByCaseRepository } from "../repositories/get-active-alerts-by-case.repository";
import { caseIdSchema } from "../schemas/sessions.schema";

export async function getActiveAlertsService(userId: string, input: unknown) {
  const { caseId } = caseIdSchema.parse({ caseId: input });

  // Segurança: garantir que o caso pertence ao usuário
  const existingCase = await findCaseByIdRepository(caseId);
  if (!existingCase || existingCase.userId !== userId) {
    throw new Error("Caso não encontrado ou acesso negado.");
  }

  return getActiveAlertsByCaseRepository(caseId);
}
