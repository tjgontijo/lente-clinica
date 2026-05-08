import "server-only";
import { listSymptomsRepository } from "../repositories/list-symptoms.repository";

export async function listSymptomsService() {
  return listSymptomsRepository();
}
