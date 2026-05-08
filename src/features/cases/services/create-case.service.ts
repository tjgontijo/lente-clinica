import { casesRepository } from "../repositories/cases.repository";
import {
  type CreateCaseInput,
  createCaseSchema,
} from "../schemas/cases.schema";

export async function createCaseService(
  userId: string,
  input: CreateCaseInput,
) {
  const data = createCaseSchema.parse(input);
  return casesRepository.create(userId, data);
}
