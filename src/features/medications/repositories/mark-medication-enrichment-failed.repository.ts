import { eq } from "drizzle-orm";
import { db } from "@/server/db/db";
import { medication } from "@/server/db/schema";

export async function markMedicationEnrichmentFailedRepository(
  id: string,
  error: string,
) {
  return db
    .update(medication)
    .set({
      enrichmentStatus: "FAILED",
      enrichmentError: error,
      enrichedAt: new Date(),
    })
    .where(eq(medication.id, id));
}
