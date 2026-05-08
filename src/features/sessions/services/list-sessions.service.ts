import { casesRepository } from "@/features/cases/repositories/cases.repository";
import { sessionsRepository } from "../repositories/sessions.repository";

export async function listSessionsService(userId: string, caseId: string) {
  // Segurança
  const existingCase = await casesRepository.findById(caseId);
  if (!existingCase || existingCase.userId !== userId) {
    throw new Error("Caso não encontrado ou acesso negado.");
  }

  return sessionsRepository.listByCase(caseId);
}
