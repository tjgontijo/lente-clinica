import "server-only";
import { listMedicationsRepository } from "../repositories/list-medications.repository";
import type { ListMedicationsInput } from "../types";

export async function listMedicationsService(input: ListMedicationsInput = {}) {
  return listMedicationsRepository(input);
}
