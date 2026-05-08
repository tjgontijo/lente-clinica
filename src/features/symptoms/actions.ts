"use server";

import { listCategoriesWithSymptomsService } from "./services/list-categories-with-symptoms.service";

export async function listCategoriesWithSymptomsAction() {
  return listCategoriesWithSymptomsService();
}
