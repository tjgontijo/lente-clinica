import "server-only";
import { db } from "@/server/db/db";
import { patientCase } from "@/server/db/schema";
import type { CreateCaseInput } from "../schemas/cases.schema";

export async function createCaseRepository(
	userId: string,
	data: CreateCaseInput,
) {
	const [result] = await db
		.insert(patientCase)
		.values({
			userId: userId,
			firstName: data.firstName,
			phoneSuffix: data.phoneSuffix,
			birthYear: data.birthYear,
		})
		.returning();
	return result;
}
