import "server-only";
import { findCaseByIdRepository } from "../repositories/find-case-by-id.repository";
import { linkMedicationRepository } from "../repositories/link-medication.repository";
import { linkMedicationSchema } from "../schemas/cases.schema";

export async function linkMedicationService(userId: string, input: unknown) {
  const data = linkMedicationSchema.parse(input);

  // Validação de segurança: garantir que o caso pertence ao usuário
  const existingCase = await findCaseByIdRepository(data.caseId);
  if (!existingCase || existingCase.userId !== userId) {
    throw new Error("Caso não encontrado ou acesso negado.");
  }

  return linkMedicationRepository(data);
}
