import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/server/db/db";
import { clinicalSession } from "@/server/db/schema";

export async function listSessionsByCaseRepository(caseId: string) {
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
}
