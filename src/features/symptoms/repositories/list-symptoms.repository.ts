import "server-only";
import { db } from "@/server/db/db";

export async function listSymptomsRepository() {
  return db.query.symptom.findMany({
    with: {
      category: true,
    },
  });
}
