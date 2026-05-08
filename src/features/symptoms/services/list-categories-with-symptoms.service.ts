import "server-only";
import { listCategoriesWithSymptomsRepository } from "../repositories/list-categories-with-symptoms.repository";

export async function listCategoriesWithSymptomsService() {
  return listCategoriesWithSymptomsRepository();
}
