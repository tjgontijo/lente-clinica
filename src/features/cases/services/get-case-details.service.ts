import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/server/db/db";
import { patientCase } from "@/server/db/schema";

export async function getCaseDetailsService(userId: string, caseId: string) {
  const result = await db.query.patientCase.findFirst({
    where: eq(patientCase.id, caseId),
    with: {
      medications: {
        with: {
          medication: {
            with: {
              class: true,
            },
          },
        },
      },
      sessions: {
        with: {
          observations: {
            with: {
              symptom: true,
            },
          },
        },
        orderBy: (sessions, { desc }) => [desc(sessions.date)],
      },
    },
  });

  if (!result || result.userId !== userId) {
    throw new Error("Caso não encontrado ou acesso negado");
  }

  return result;
}
