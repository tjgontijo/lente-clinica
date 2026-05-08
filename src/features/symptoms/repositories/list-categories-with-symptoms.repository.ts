import "server-only";
import { db } from "@/server/db/db";

export async function listCategoriesWithSymptomsRepository() {
  return db.query.symptomCategory.findMany({
    with: {
      symptoms: true,
    },
    orderBy: (categories, { asc }) => [asc(categories.name)],
  });
}
