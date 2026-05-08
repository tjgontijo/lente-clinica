import "server-only";
import { createCaseRepository } from "../repositories/create-case.repository";
import { createCaseSchema } from "../schemas/cases.schema";

export async function createCaseService(userId: string, input: unknown) {
  const data = createCaseSchema.parse(input);
  return createCaseRepository(userId, data);
}
