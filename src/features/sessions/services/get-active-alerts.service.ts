import { casesRepository } from "@/features/cases/repositories/cases.repository";
import { sessionsRepository } from "../repositories/sessions.repository";

export async function getActiveAlertsService(userId: string, caseId: string) {
  // Segurança: garantir que o caso pertence ao usuário
  const existingCase = await casesRepository.findById(caseId);
  if (!existingCase || existingCase.userId !== userId) {
    throw new Error("Caso não encontrado ou acesso negado.");
  }

  return sessionsRepository.getActiveAlerts(caseId);
}
