import "server-only";
import { db } from "@/server/db/db";

export async function listActiveMedicationsForCaseRepository(caseId: string) {
  return db.query.patientMedication.findMany({
    where: (pm, { eq, and }) =>
      and(eq(pm.caseId, caseId), eq(pm.isCurrent, true)),
    with: {
      medication: true,
    },
  });
}
