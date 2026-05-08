import { eq } from "drizzle-orm";
import type { MedicationEnrichmentOutput } from "@/features/medications/schemas/medication-enrichment.schema";
import { db } from "@/server/db/db";
import { medication } from "@/server/db/schema";

export async function updateMedicationEnrichmentDraftRepository(
  id: string,
  data: MedicationEnrichmentOutput,
  metadata: {
    model: string;
    promptVersion: string;
  },
) {
  return db
    .update(medication)
    .set({
      ...data,
      enrichmentStatus: "NEEDS_REVIEW",
      enrichmentModel: metadata.model,
      enrichmentPromptVersion: metadata.promptVersion,
      enrichedAt: new Date(),
      enrichmentError: null,
    })
    .where(eq(medication.id, id));
}
