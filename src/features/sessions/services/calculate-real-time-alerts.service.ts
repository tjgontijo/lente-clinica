import "server-only";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/server/db/db";
import {
  medication,
  medicationSymptomAlert,
  patientMedication,
  symptom,
} from "@/server/db/schema";

export async function calculateRealTimeAlertsService(
  userId: string,
  caseId: string,
  symptomIds: string[],
) {
  if (!symptomIds.length) return [];

  return db.query.medicationSymptomAlert.findMany({
    where: and(
      inArray(medicationSymptomAlert.symptomId, symptomIds),
      inArray(
        medicationSymptomAlert.medicationId,
        db
          .select({ medicationId: patientMedication.medicationId })
          .from(patientMedication)
          .where(
            and(
              eq(patientMedication.caseId, caseId),
              eq(patientMedication.isCurrent, true),
            ),
          ),
      ),
    ),
    with: {
      medication: true,
      symptom: true,
    },
  });
}
