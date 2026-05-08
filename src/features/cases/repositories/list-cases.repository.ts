import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/server/db/db";
import { patientCase } from "@/server/db/schema";

export async function listCasesRepository(userId: string) {
  return db.query.patientCase.findMany({
    where: eq(patientCase.userId, userId),
    orderBy: (cases, { desc }) => [desc(cases.createdAt)],
    with: {
      medications: {
        with: {
          medication: true,
        },
      },
    },
  });
}
