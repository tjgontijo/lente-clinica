import "server-only";
import { db } from "@/server/db/db";
import { clinicalSession, sessionObservation } from "@/server/db/schema";

export async function createSessionRepository(data: {
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
}
