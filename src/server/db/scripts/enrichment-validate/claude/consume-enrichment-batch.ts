import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";
import { medicationEnrichmentSchema } from "@/features/medications/schemas/medication-enrichment.schema";

function getMedicationSlugFromCustomId(
  customId: string,
  mapping: Record<string, string>,
) {
  if (mapping[customId]) {
    return mapping[customId];
  }
  if (customId?.startsWith("medication-enrichment_")) {
    return customId.replace("medication-enrichment_", "");
  }
  throw new Error(`Invalid custom_id format or mapping missing: ${customId}`);
}

function sanitizeSerializedJson(str: string): string {
  let s = str;
  // Protect keys
  s = s.replace(
    /"(name|content|level|signal|action)"/g,
    "__QUOTE__$1__QUOTE__",
  );
  // Protect value boundaries
  s = s.replace(/:\s*"/g, ": __QUOTE__");
  s = s.replace(/"\s*,\s*\n/g, "__QUOTE__,\n");
  s = s.replace(/"\s*,\s*\r\n/g, "__QUOTE__,\r\n");
  s = s.replace(/"\s*}/g, "__QUOTE__}");
  s = s.replace(/{\s*"/g, "{__QUOTE__");
  s = s.replace(/"\s*,\s*$/gm, "__QUOTE__,");
  s = s.replace(/"\s*$/gm, "__QUOTE__");
  s = s.replace(/^\s*"/gm, "  __QUOTE__");

  // Replace remaining double quotes with single quotes
  s = s.replace(/"/g, "'");
  // Restore protected structural quotes
  s = s.replace(/__QUOTE__/g, '"');
  return s;
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set.");
  }

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const outputsDir = path.join(__dirname, "outputs");
  if (!fs.existsSync(outputsDir)) {
    fs.mkdirSync(outputsDir, { recursive: true });
  }

  // 1. Carregar medicamento pré-aquecido (primed_medication.json) se existir
  const consolidatedResults: Record<string, any> = {};
  const primedFilePath = path.join(outputsDir, "primed_medication.json");

  if (fs.existsSync(primedFilePath)) {
    try {
      const primedData = JSON.parse(fs.readFileSync(primedFilePath, "utf-8"));
      Object.assign(consolidatedResults, primedData);
      console.log(
        `🔥 Loaded primed medication: ${Object.keys(primedData).join(", ")}`,
      );
    } catch (err) {
      console.error("⚠️ Failed to parse primed_medication.json:", err);
    }
  }

  // 2. Obter o batchId (do active-batch.json ou do argumento)
  let batchId = process.argv[2];

  if (!batchId) {
    const activeBatchPath = path.join(__dirname, "active-batch.json");
    if (fs.existsSync(activeBatchPath)) {
      const activeBatchData = JSON.parse(
        fs.readFileSync(activeBatchPath, "utf-8"),
      );
      batchId = activeBatchData.batchId;
    }
  }

  if (!batchId) {
    console.warn(
      "⚠️ No active batch ID found. Proceeding with primed results only.",
    );
  }

  let successCount = Object.keys(consolidatedResults).length;
  let failCount = 0;

  if (batchId && batchId !== "none_primed_only") {
    console.log(`🔍 Checking status for Claude batch: ${batchId}...`);

    const batch = await anthropic.messages.batches.retrieve(batchId);
    console.log(`📦 Status: ${batch.processing_status}`);
    console.log(`📊 Request Counts:`, batch.request_counts);

    if (batch.processing_status !== "ended") {
      console.log(
        `\n⏳ Batch is still processing (status: ${batch.processing_status}). Try again later.`,
      );
      // Se tivermos algum resultado primed, vamos salvá-lo temporariamente na pasta outputs para não perder trabalho
      if (successCount > 0) {
        const consolidatedFilePath = path.join(
          outputsDir,
          "calibrated_medications.json",
        );
        fs.writeFileSync(
          consolidatedFilePath,
          JSON.stringify(consolidatedResults, null, 2),
        );
      }
      return;
    }

    if (!batch.results_url) {
      console.warn(`⚠️ Batch ended but has no results_url.`);
      return;
    }

    console.log(`✨ Batch ended! Downloading results...`);
    const resultsResponse = await anthropic.messages.batches.results(batchId);

    // Carregar mapeamento de customId para slug
    let slugMapping: Record<string, string> = {};
    const mappingPath = path.join(__dirname, "active-batch-mapping.json");
    if (fs.existsSync(mappingPath)) {
      try {
        slugMapping = JSON.parse(fs.readFileSync(mappingPath, "utf-8"));
        console.log(
          `🗺️ Loaded slug mapping dictionary with ${Object.keys(slugMapping).length} entries.`,
        );
      } catch (err) {
        console.error("⚠️ Failed to parse active-batch-mapping.json:", err);
      }
    }

    for await (const item of resultsResponse) {
      let medSlug: string;
      try {
        medSlug = getMedicationSlugFromCustomId(item.custom_id, slugMapping);
      } catch (err: any) {
        console.error(
          `❌ Slug resolution error for custom_id: ${item.custom_id}.`,
          err.message,
        );
        failCount++;
        continue;
      }

      if (item.result.type !== "succeeded") {
        console.error(`❌ Item failed for ${medSlug}: ${item.result.type}`);
        console.error(JSON.stringify(item.result, null, 2));
        failCount++;
        continue;
      }

      const message = item.result.message;
      try {
        const toolUseBlock = message.content.find(
          (c: any) => c.type === "tool_use",
        );

        if (!toolUseBlock || !("input" in toolUseBlock)) {
          throw new Error("No tool_use block found in response");
        }
        const parsed = { ...(toolUseBlock.input as any) } as any;

        // Auto-healer: Converte campos que vieram como JSON string em arrays/objetos reais
        const jsonFields = [
          "clinicalDomains",
          "sessionDiscriminationQuestions",
          "communicationScenarios",
          "attentionSignals",
        ];
        for (const field of jsonFields) {
          if (typeof parsed[field] === "string") {
            const trimmed = parsed[field].trim();
            if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
              try {
                parsed[field] = JSON.parse(trimmed);
                console.log(
                  `🔧 [Auto-Healed] Parsed JSON string inside field "${field}" for ${medSlug}`,
                );
              } catch (e) {
                try {
                  const sanitized = sanitizeSerializedJson(trimmed);
                  parsed[field] = JSON.parse(sanitized);
                  console.log(
                    `🔧 [Auto-Healed with Sanitization] Parsed sanitized JSON string inside field "${field}" for ${medSlug}`,
                  );
                } catch (e2: any) {
                  console.error(
                    `❌ [Auto-Healer Fail] Could not parse "${field}" for ${medSlug}:`,
                    e2.message,
                  );
                }
              }
            }
          }
        }

        // Validar com Zod para garantir integridade absoluta dos dados
        const validated = medicationEnrichmentSchema.parse(parsed);

        // Adicionar ao resultado consolidado
        consolidatedResults[medSlug] = validated;
        console.log(`✅ Validated: ${medSlug}`);
        successCount++;
      } catch (err) {
        console.error(`❌ Validation error for ${medSlug}:`, err);
        failCount++;
      }
    }
  }

  // 3. Salvar o arquivo JSON consolidado final
  if (successCount > 0) {
    const consolidatedFilePath = path.join(
      outputsDir,
      "calibrated_medications.json",
    );
    fs.writeFileSync(
      consolidatedFilePath,
      JSON.stringify(consolidatedResults, null, 2),
    );
    console.log(
      `\n💾 Saved consolidated JSON to: ${path.relative(process.cwd(), consolidatedFilePath)}`,
    );

    // Limpar o arquivo primed temporário se tudo deu certo
    if (fs.existsSync(primedFilePath)) {
      fs.unlinkSync(primedFilePath);
      console.log(`🧹 Cleaned up temporary primed_medication.json`);
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log("🎉 CLAUDE BATCH PROCESSING COMPLETED!");
  console.log("=".repeat(50));
  console.log(
    `📂 Outputs folder:  ${path.relative(process.cwd(), outputsDir)}`,
  );
  console.log(`✅ Total consolidated:  ${successCount} medicines`);
  console.log(`❌ Failed:              ${failCount} medicines`);
  console.log("=".repeat(50) + "\n");
}

main().catch((err) => {
  console.error("❌ Error consuming batch:", err);
  process.exit(1);
});
