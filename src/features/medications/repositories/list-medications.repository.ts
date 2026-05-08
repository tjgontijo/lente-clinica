import "server-only";
import { and, eq, exists, ilike, or } from "drizzle-orm";
import { db } from "@/server/db/db";
import { medication, medicationProduct } from "@/server/db/schema";

export async function listMedicationsRepository(search?: string) {
  const searchPattern = `%${search}%`;

  return db.query.medication.findMany({
    where: search
      ? or(
          ilike(medication.name, searchPattern),
          exists(
            db
              .select()
              .from(medicationProduct)
              .where(
                and(
                  eq(medicationProduct.medicationId, medication.id),
                  ilike(medicationProduct.productName, searchPattern),
                ),
              ),
          ),
        )
      : undefined,
    with: {
      class: true,
      products: true,
    },
  });
}
