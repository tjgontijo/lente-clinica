import "dotenv/config";
import OpenAI from "openai";
import { db } from "@/server/db/db";
import { medication } from "@/server/db/schema";
import { and, eq, isNotNull } from "drizzle-orm";
import { medicationEnrichmentSchema } from "@/features/medications/schemas/medication-enrichment.schema";

const CUSTOM_ID_PREFIX = "medication-enrichment:";

function getMedicationIdFromCustomId(customId: string) {
  if (!customId?.startsWith(CUSTOM_ID_PREFIX)) {
    throw new Error(`Invalid custom_id: ${customId}`);
  }

  return customId.replace(CUSTOM_ID_PREFIX, "");
}

async function markBatchAsFailed(batchId: string, reason: string) {
  await db
    .update(medication)
    .set({
      enrichmentStatus: "FAILED",
      enrichmentError: reason,
    })
    .where(eq(medication.enrichmentBatchId, batchId));
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set.");
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // 1. Buscar batches pendentes no banco
  const pendingMedications = await db.query.medication.findMany({
    where: and(
      eq(medication.enrichmentStatus, "PENDING_BATCH"),
      isNotNull(medication.enrichmentBatchId)
    ),
    columns: {
      enrichmentBatchId: true,
    },
  });

  const batchIds = Array.from(
    new Set(pendingMedications.map((m) => m.enrichmentBatchId).filter(Boolean))
  ) as string[];

  if (batchIds.length === 0) {
    console.log("✅ No pending batches found in database.");
    return;
  }

  console.log(`🔍 Checking status for ${batchIds.length} batch(es)...`);

  for (const batchId of batchIds) {
    const batch = await openai.batches.retrieve(batchId);
    console.log(`📦 Batch ${batchId}: ${batch.status}`);

    // Tratar status de falha terminal
    if (["failed", "expired", "cancelled"].includes(batch.status)) {
      console.error(`❌ Batch ${batchId} ended with status: ${batch.status}`);

      await markBatchAsFailed(
        batchId,
        `Batch ${batch.status}: ${JSON.stringify(batch.errors ?? null)}`
      );

      continue;
    }

    if (batch.status !== "completed") {
      console.log(`⏳ Batch ${batchId} is still ${batch.status}. Try again later.`);
      continue;
    }

    // 2. Tratar arquivo de erros individuais (se existir)
    if (batch.error_file_id) {
      console.log(`⚠️ Batch has error file: ${batch.error_file_id}`);

      const errorFileResponse = await openai.files.content(batch.error_file_id);
      const errorsText = await errorFileResponse.text();
      const errorLines = errorsText.split("\n").filter(Boolean);

      for (const line of errorLines) {
        const errorResult = JSON.parse(line);
        const medId = getMedicationIdFromCustomId(errorResult.custom_id);

        await db.update(medication).set({
          enrichmentStatus: "FAILED",
          enrichmentError: JSON.stringify(errorResult.error ?? errorResult),
          enrichmentRawResponse: errorResult,
        }).where(eq(medication.id, medId));

        console.error(`❌ Batch item failed: ${medId}`);
      }
    }

    if (!batch.output_file_id) {
      console.warn(`⚠️ Batch ${batchId} completed but has no output_file_id.`);
      continue;
    }

    // 3. Processar sucessos
    console.log(`✨ Batch completed! Downloading results from ${batch.output_file_id}...`);

    const fileResponse = await openai.files.content(batch.output_file_id);
    const resultsText = await fileResponse.text();
    const lines = resultsText.split("\n").filter(Boolean);

    console.log(`📥 Processing ${lines.length} results...`);

    for (const line of lines) {
      const result = JSON.parse(line);
      const medId = getMedicationIdFromCustomId(result.custom_id);

      if (!result.response) {
        await db.update(medication).set({
          enrichmentStatus: "FAILED",
          enrichmentError: JSON.stringify(result.error ?? result),
          enrichmentRawResponse: result,
        }).where(eq(medication.id, medId));

        continue;
      }

      const response = result.response;

      if (response.status_code !== 200) {
        console.error(`❌ Error in result for ${medId}: Status ${response.status_code}`);
        await db.update(medication).set({
          enrichmentStatus: "FAILED",
          enrichmentError: `API Status ${response.status_code}`,
          enrichmentRawResponse: response,
        }).where(eq(medication.id, medId));
        continue;
      }

      try {
        const choice = response.body.choices?.[0];

        if (!choice) {
          throw new Error("Missing choice in OpenAI response");
        }

        if (choice.finish_reason === "length") {
          throw new Error("Completion was truncated (max_tokens reached)");
        }

        const content = choice.message?.content;

        if (!content) {
          throw new Error("Empty message content");
        }

        const parsed = JSON.parse(content);
        
        // Validar com Zod
        const validated = medicationEnrichmentSchema.parse(parsed);

        // Atualizar medicamento
        await db.update(medication).set({
          ...validated,
          enrichmentStatus: "NEEDS_REVIEW",
          enrichmentModel: response.body.model,
          enrichedAt: new Date(),
          enrichmentRawResponse: response.body,
          enrichmentError: null,
        }).where(eq(medication.id, medId));

        console.log(`✅ Updated medication: ${medId}`);
      } catch (err) {
        console.error(`❌ Validation error for ${medId}:`, err);
        await db.update(medication).set({
          enrichmentStatus: "FAILED",
          enrichmentError: err instanceof Error ? err.message : String(err),
          enrichmentRawResponse: response.body,
        }).where(eq(medication.id, medId));
      }
    }
  }
}

main().catch((err) => {
  console.error("❌ Error consuming batch:", err);
  process.exit(1);
});
