"use server";

import { listSymptomsService } from "./services/list-symptoms.service";

export async function listSymptomsAction() {
  return listSymptomsService();
}
