import "server-only";
import { and, eq } from "drizzle-orm";
import { db } from "@/server/db/db";
import { medication } from "@/server/db/schema";
import type { ListMedicationsInput, ListMedicationsResult } from "../types";

const DEFAULT_LIMIT = 50;

export async function listMedicationsRepository(
  input: ListMedicationsInput = {},
): Promise<ListMedicationsResult> {
  const { search, offset = 0, limit = DEFAULT_LIMIT } = input;
  const searchPattern = `%${search}%`;

  const items = await db.query.medicationProduct.findMany({
    where: (table, { or, ilike, exists, and }) => {
      const searchFilters = search
        ? or(
            ilike(table.productName, searchPattern),
            exists(
              db
                .select()
                .from(medication)
                .where(
                  and(
                    eq(medication.id, table.medicationId),
                    ilike(medication.name, searchPattern),
                  ),
                ),
            ),
          )
        : undefined;

      const visibleMedicationFilter = exists(
        db
          .select()
          .from(medication)
          .where(
            and(
              eq(medication.id, table.medicationId),
              eq(medication.isVisible, true),
            ),
          ),
      );

      return searchFilters
        ? and(visibleMedicationFilter, searchFilters)
        : visibleMedicationFilter;
    },
    with: {
      medication: {
        with: {
          class: true,
        },
      },
    },
    orderBy: (table, { asc }) => [asc(table.productName), asc(table.id)],
    limit: limit + 1,
    offset,
  });

  const hasMore = items.length > limit;
  const paginatedItems = hasMore ? items.slice(0, limit) : items;

  return {
    items: paginatedItems,
    nextOffset: hasMore ? offset + limit : null,
  };
}
