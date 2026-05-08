import "server-only";
import { db } from "@/server/db/db";
import { medication } from "@/server/db/schema";
import { ilike, or } from "drizzle-orm";

export async function listMedicationsRepository(search?: string) {
	return db.query.medication.findMany({
		where: search
			? or(
					ilike(medication.name, `%${search}%`),
					ilike(medication.genericName, `%${search}%`),
			  )
			: undefined,
		with: {
			class: true,
		},
	});
}
