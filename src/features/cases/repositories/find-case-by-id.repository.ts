import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/server/db/db";
import { patientCase } from "@/server/db/schema";

export async function findCaseByIdRepository(id: string) {
  return db.query.patientCase.findFirst({
    where: eq(patientCase.id, id),
  });
}
