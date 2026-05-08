import "server-only";
import { db } from "@/server/db/db";

export async function getActiveAlertsByCaseRepository(caseId: string) {
  const result = await db.query.patientMedication.findMany({
    where: (pm, { eq, and }) =>
      and(eq(pm.caseId, caseId), eq(pm.isCurrent, true)),
    with: {
      medication: {
        with: {
          symptomAlerts: {
            with: {
              symptom: true,
            },
          },
        },
      },
    },
  });

  // Flatten and group by severity
  const alerts = result.flatMap((pm) =>
    pm.medication.symptomAlerts.map((alert) => ({
      medicationName: pm.medication.name,
      symptomName: alert.symptom.name,
      severity: alert.severity,
      context: alert.context,
    })),
  );

  return {
    red: alerts.filter((a) => a.severity === "RED"),
    yellow: alerts.filter((a) => a.severity === "YELLOW"),
  };
}
