import "dotenv/config";
import fs from "fs";
import OpenAI from "openai";
import { db } from "../db";
import { medication } from "../schema";
import { eq } from "drizzle-orm";

async function main() {
  const batchId = process.argv[2];
  if (!batchId) {
    console.error("❌ Por favor, forneça o ID do batch: npx tsx src/server/db/scripts/consume-relevance-batch.ts <batch_id>");
    process.exit(1);
  }

  const openai = new OpenAI();
  console.log(`⏳ Recuperando resultados do batch: ${batchId}...`);

  const batch = await openai.batches.retrieve(batchId);
  if (batch.status !== "completed") {
    console.error(`❌ Batch ainda não concluído. Status atual: ${batch.status}`);
    process.exit(1);
  }

  if (!batch.output_file_id) {
    console.error("❌ Batch sem arquivo de saída.");
    process.exit(1);
  }

  const fileResponse = await openai.files.content(batch.output_file_id);
  const fileContent = await fileResponse.text();
  const lines = fileContent.trim().split("\n");

  console.log(`📊 Processando ${lines.length} resultados...`);

  let updatedCount = 0;
  let errorCount = 0;

  for (const line of lines) {
    if (!line.trim()) continue;
    
    try {
      const result = JSON.parse(line);
      const medicationId = result.custom_id.split(":").pop();
      if (!medicationId) continue;

      const response = result.response.body.choices[0].message.content;
      const { score, reason, category } = JSON.parse(response);

      await db
        .update(medication)
        .set({
          mentalHealthRelevance: score,
          mentalHealthRelevanceReason: reason,
          mentalHealthCategory: category,
          // Se o score for alto o suficiente, já marcamos para o próximo passo de enriquecimento
          shouldEnrichWithLlm: score >= 6,
          isVisible: score >= 6, // Também atualiza a visibilidade
        })
        .where(eq(medication.id, medicationId));

      updatedCount++;
      if (updatedCount % 50 === 0)
        console.log(`✅ ${updatedCount} medicamentos atualizados...`);
    } catch (err) {
      errorCount++;
      try {
        const result = JSON.parse(line);
        const medicationId = result.custom_id.replace(
          "medication-relevance:",
          "",
        );
        console.error(
          `\n❌ Erro no medicamento ${medicationId}:`,
          (err as Error).message,
        );
        // Log partial response to debug
        if (result.response?.body?.choices?.[0]?.message?.content) {
          console.log(
            "Início da resposta:",
            result.response.body.choices[0].message.content.substring(0, 200),
          );
        }
      } catch (innerErr) {
        console.error(`\n❌ Erro fatal ao processar linha corrompida:`, err);
      }
    }
  }

  console.log(
    `\n🎉 Concluído! ${updatedCount} atualizados, ${errorCount} falhas.`,
  );
  console.log(
    `💡 Nota: Medicamentos com score >= 6 foram marcados para enriquecimento automático.`,
  );
}

main().catch(console.error);
