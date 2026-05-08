import "server-only";
import { db } from "@/server/db/db";
import { patientMedication } from "@/server/db/schema";
import type { LinkMedicationInput } from "../schemas/cases.schema";

export async function linkMedicationRepository(data: LinkMedicationInput) {
  const [result] = await db
    .insert(patientMedication)
    .values({
      caseId: data.caseId,
      medicationId: data.medicationId,
      isCurrent: data.isCurrent,
    })
    .onConflictDoUpdate({
      target: [patientMedication.caseId, patientMedication.medicationId],
      set: { isCurrent: data.isCurrent },
    })
    .returning();
  return result;
}
