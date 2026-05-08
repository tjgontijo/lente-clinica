import "server-only";
import { db } from "@/server/db/db";
import { symptom } from "@/server/db/schema";

export async function listSymptomsService() {
  return db.select().from(symptom);
}
