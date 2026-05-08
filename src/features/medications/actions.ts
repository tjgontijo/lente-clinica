"use server";

import { listMedicationsService } from "./services/list-medications.service";

export async function listMedicationsAction(search?: string) {
  return listMedicationsService(search);
}
