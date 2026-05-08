import { and, eq, ne } from "drizzle-orm";
import { db } from "@/server/db/db";

export interface ListForEnrichmentOptions {
  limit?: number;
  force?: boolean;
  only?: string;
}

export async function listMedicationsForEnrichmentRepository(
  options: ListForEnrichmentOptions = {},
) {
  const { limit, force, only } = options;

  return db.query.medication.findMany({
    where: (table) => {
      const conditions = [];

      // Only substances flagged for enrichment
      conditions.push(eq(table.shouldEnrichWithLlm, true));

      if (only) {
        conditions.push(eq(table.name, only));
      } else if (!force) {
        // Skip DONE unless forced
        conditions.push(ne(table.enrichmentStatus, "DONE"));
      }

      return and(...conditions);
    },
    limit: limit,
    with: {
      class: true,
      products: true,
    },
  });
}
