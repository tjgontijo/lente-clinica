import "server-only";
import { db } from "@/server/db/db";
import { medication } from "@/server/db/schema";

export async function listMedicationsService() {
  return db.select().from(medication);
}
