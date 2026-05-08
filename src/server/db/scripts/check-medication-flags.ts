import "dotenv/config";
import { db } from "../db";
import { medication, medicationClass } from "../schema";
import { eq, ilike } from "drizzle-orm";

async function main() {
  const results = await db.select({
    medName: medication.name,
    className: medicationClass.name,
    shouldEnrich: medication.shouldEnrichWithLlm,
    status: medication.enrichmentStatus
  })
  .from(medication)
  .innerJoin(medicationClass, eq(medication.classId, medicationClass.id))
  .where(ilike(medicationClass.name, "J7D1%"))
  .limit(10);

  console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error);
