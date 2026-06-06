"use server";

import { listMedicationsService } from "./services/list-medications.service";
import type { ListMedicationsInput } from "./types";

export async function listMedicationsAction(input: ListMedicationsInput = {}) {
  return listMedicationsService(input);
}
