import "server-only";
import { db } from "@/server/db/db";

export async function listMedicationsRepository() {
  return db.query.medication.findMany({
    with: {
      class: true,
    },
  });
}
