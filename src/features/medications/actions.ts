"use server";

import { listMedicationsService } from "./services/list-medications.service";

export async function listMedicationsAction() {
  return listMedicationsService();
}
