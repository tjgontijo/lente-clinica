import "server-only";
import { listMedicationsRepository } from "../repositories/list-medications.repository";

export async function listMedicationsService() {
  return listMedicationsRepository();
}
