import "server-only";
import { listMedicationsRepository } from "../repositories/list-medications.repository";

export async function listMedicationsService(search?: string) {
	return listMedicationsRepository(search);
}
