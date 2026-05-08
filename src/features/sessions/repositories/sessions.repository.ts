import { eq } from "drizzle-orm";
import { db } from "@/server/db/db";
import {
  clinicalSession,
  sessionObservation,
} from "@/server/db/schema";

export const sessionsRepository = {
  async create(data: {
    caseId: string;
    date: Date;
    notes?: string;
    symptomIds: string[];
  }) {
    return db.transaction(async (tx) => {
      const [session] = await tx
        .insert(clinicalSession)
        .values({
          caseId: data.caseId,
          date: data.date,
          notes: data.notes,
        })
        .returning();

      if (data.symptomIds.length > 0) {
        await tx.insert(sessionObservation).values(
          data.symptomIds.map((symptomId) => ({
            sessionId: session.id,
            symptomId,
          })),
        );
      }

      return session;
    });
  },

  async listByCase(caseId: string) {
    return db.query.clinicalSession.findMany({
      where: eq(clinicalSession.caseId, caseId),
      orderBy: (sessions, { desc }) => [desc(sessions.date)],
      with: {
        observations: {
          with: {
            symptom: true,
          },
        },
      },
    });
  },

  async getActiveAlerts(caseId: string) {
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
  },
};
