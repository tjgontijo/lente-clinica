import { casesRepository } from "../repositories/cases.repository";

export async function listCasesService(userId: string) {
  return casesRepository.listByUser(userId);
}
