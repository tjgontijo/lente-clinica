import { casesRepository } from "../repositories/cases.repository";
import {
  type LinkMedicationInput,
  linkMedicationSchema,
} from "../schemas/cases.schema";

export async function linkMedicationService(
  userId: string,
  input: LinkMedicationInput,
) {
  const data = linkMedicationSchema.parse(input);

  // Validação de segurança: garantir que o caso pertence ao usuário
  const existingCase = await casesRepository.findById(data.caseId);
  if (!existingCase || existingCase.userId !== userId) {
    throw new Error("Caso não encontrado ou acesso negado.");
  }

  return casesRepository.linkMedication(data);
}
