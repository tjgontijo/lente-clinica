import "server-only";
import { ilike } from "drizzle-orm";
import { db } from "@/server/db/db";
import { medication } from "@/server/db/schema";

export async function listMedicationsRepository(search?: string) {
  return db.query.medication.findMany({
    where: search ? ilike(medication.name, `%${search}%`) : undefined,
    with: {
      class: true,
      products: true,
    },
  });
}
