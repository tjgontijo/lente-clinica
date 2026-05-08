import { casesRepository } from "@/features/cases/repositories/cases.repository";
import { sessionsRepository } from "../repositories/sessions.repository";

export interface CreateSessionInput {
  caseId: string;
  date: Date;
  notes?: string;
  symptomIds: string[];
}

export async function createSessionService(
  userId: string,
  input: CreateSessionInput,
) {
  // Segurança: garantir que o caso pertence ao usuário
  const existingCase = await casesRepository.findById(input.caseId);
  if (!existingCase || existingCase.userId !== userId) {
    throw new Error("Caso não encontrado ou acesso negado.");
  }

  return sessionsRepository.create(input);
}
