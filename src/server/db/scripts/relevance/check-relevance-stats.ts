import "dotenv/config";
import { gte, lt } from "drizzle-orm";
import { db } from "../../db";
import { medication } from "../../schema";

async function main() {
  const all = await db.select().from(medication);
  const relevant = all.filter((m) => (m.mentalHealthRelevance ?? 0) >= 6);
  const low = all.filter((m) => (m.mentalHealthRelevance ?? 0) < 6);

  console.log(`📊 TOTAL NO BANCO: ${all.length}`);
  console.log(`✅ RELEVANTES (Score >= 6): ${relevant.length}`);
  console.log(`📉 BAIXA RELEVÂNCIA (Score < 6): ${low.length}`);
  console.log(`\nFrequência por Score:`);
  const counts: Record<number, number> = {};
  all.forEach((m) => {
    const s = m.mentalHealthRelevance ?? 0;
    counts[s] = (counts[s] || 0) + 1;
  });
  Object.keys(counts)
    .sort((a, b) => Number(b) - Number(a))
    .forEach((s) => {
      console.log(`Score ${s}: ${counts[Number(s)]} medicamentos`);
    });
}

main().catch(console.error);
