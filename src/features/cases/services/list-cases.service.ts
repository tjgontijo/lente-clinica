import "server-only";
import { listCasesRepository } from "../repositories/list-cases.repository";

export async function listCasesService(userId: string) {
  return listCasesRepository(userId);
}
