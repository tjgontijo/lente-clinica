import "dotenv/config";
import { eq, sql } from "drizzle-orm";
import { db } from "../../db";
import { medication, medicationClass } from "../../schema";

async function main() {
  const results = await db
    .select({
      klass: medicationClass.name,
      count: sql<number>`count(${medication.id})`,
    })
    .from(medication)
    .innerJoin(medicationClass, eq(medication.classId, medicationClass.id))
    .groupBy(medicationClass.name)
    .orderBy(sql`count(${medication.id}) DESC`)
    .limit(20);

  console.log("Top 20 classes:");
  console.table(results);
}

main().catch(console.error);
