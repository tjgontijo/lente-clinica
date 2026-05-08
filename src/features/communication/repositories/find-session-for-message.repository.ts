import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/server/db/db";
import { clinicalSession } from "@/server/db/schema";

export async function findSessionForMessageRepository(sessionId: string) {
  return db.query.clinicalSession.findFirst({
    where: eq(clinicalSession.id, sessionId),
    with: {
      patientCase: true,
      observations: {
        with: {
          symptom: true,
        },
      },
    },
  });
}
