import "dotenv/config";
import { and, count, eq } from "drizzle-orm";
import { db } from "@/server/db/db";
import { medication } from "@/server/db/schema";

async function main() {
  const [totalEnrichable] = await db
    .select({ value: count() })
    .from(medication)
    .where(eq(medication.shouldEnrichWithLlm, true));

  const [pendingEnrichment] = await db
    .select({ value: count() })
    .from(medication)
    .where(
      and(
        eq(medication.shouldEnrichWithLlm, true),
        eq(medication.enrichmentStatus, "PENDING"),
      ),
    );

  console.log(`📊 Status do Enriquecimento:`);
  console.log(`- Total marcados como relevantes: ${totalEnrichable.value}`);
  console.log(`- Pendentes de enriquecimento:   ${pendingEnrichment.value}`);

  if (totalEnrichable.value === 0) {
    console.log(
      "\n⚠️  Nenhum medicamento marcado para enriquecer. Você já rodou o 'consume-relevance-batch.ts'?",
    );
  } else if (pendingEnrichment.value > 0) {
    console.log("\n🚀 Pronto para gerar o batch de enriquecimento!");
    console.log("Comando: npm run enrich:medications:batch:generate");
  } else {
    console.log("\n✅ Tudo já está enriquecido ou em processo.");
  }
}

main().catch(console.error);
