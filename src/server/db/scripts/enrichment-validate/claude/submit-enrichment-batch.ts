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

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set. Add it to your .env file.");
  }

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const files = fs
    .readdirSync(process.cwd())
    .filter(
      (f) => f.startsWith("claude_enrichment_batch_") && f.endsWith(".jsonl"),
    );

  const argFileName = process.argv[2];
  const fileName = argFileName ?? files.sort().reverse()[0];

  if (!fileName) {
    console.error(
      "❌ No batch file found. Run the claude generate script first.",
    );
    process.exit(1);
  }

  const filePath = path.join(process.cwd(), fileName);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Batch file not found: ${filePath}`);
  }

  console.log(`🚀 Reading batch file: ${fileName}...`);
  const content = fs.readFileSync(filePath, "utf-8");

  const requests: any[] = content
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));

  if (requests.length === 0) {
    console.error("❌ No requests found in the batch file.");
    process.exit(1);
  }

  // Carregar mapeamento de customId para slug
  let slugMapping: Record<string, string> = {};
  const mappingPath = path.join(__dirname, "active-batch-mapping.json");
  if (fs.existsSync(mappingPath)) {
    try {
      slugMapping = JSON.parse(fs.readFileSync(mappingPath, "utf-8"));
    } catch (err) {
      console.error("⚠️ Failed to parse active-batch-mapping.json:", err);
    }
  }

  // ---- PASSO DE WARMUP DO CACHE ----
  const firstReq = requests[0];
  const firstSlug = getMedicationSlugFromCustomId(
    firstReq.custom_id,
    slugMapping,
  );

  console.log(
    `\n🔥 [1/2] PRIMING CACHE: Running first request (${firstSlug}) synchronously to warm the Claude prompt cache...`,
  );
  const startTime = Date.now();

  const response = await anthropic.messages.create({
    model: firstReq.params.model,
    max_tokens: firstReq.params.max_tokens,
    temperature: firstReq.params.temperature,
    system: firstReq.params.system,
    messages: firstReq.params.messages,
    tools: firstReq.params.tools,
    tool_choice: firstReq.params.tool_choice,
  });

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`✅ First request processed successfully in ${duration}s!`);

  // Exibir estatísticas de tokens e cache do primeiro request
  console.log(`📊 Usage Stats:`, response.usage);

  // Processar e salvar o resultado síncrono localmente
  const toolUseBlock = response.content.find((c: any) => c.type === "tool_use");
  if (!toolUseBlock || !("input" in toolUseBlock)) {
    throw new Error("No tool_use block found in warmup response");
  }

  const validatedResult = medicationEnrichmentSchema.parse((toolUseBlock as any).input);

  // Criar pasta de outputs se não existir
  const outputsDir = path.join(__dirname, "outputs");
  if (!fs.existsSync(outputsDir)) {
    fs.mkdirSync(outputsDir, { recursive: true });
  }

  const primedFilePath = path.join(outputsDir, "primed_medication.json");
  fs.writeFileSync(
    primedFilePath,
    JSON.stringify({ [firstSlug]: validatedResult }, null, 2),
  );
  console.log(`💾 Saved primed medication result to: primed_medication.json`);

  // ---- PASSO DE SUBMISSÃO DO RESTANTE EM BATCH ----
  const remainingRequests = requests.slice(1);

  if (remainingRequests.length === 0) {
    console.log(
      "\n😎 Only 1 request was present in the batch. No need to submit batch to Anthropic.",
    );
    console.log(
      "🎉 Run consume-enrichment-batch.ts to generate the final consolidated JSON immediately!",
    );

    // Escrever um active-batch vazio ou de controle
    const activeBatchPath = path.join(__dirname, "active-batch.json");
    fs.writeFileSync(
      activeBatchPath,
      JSON.stringify({ batchId: "none_primed_only" }, null, 2),
    );
    return;
  }

  console.log(
    `\n🚀 [2/2] SUBMITTING BATCH: Creating Anthropic Batch with remaining ${remainingRequests.length} requests...`,
  );

  const messageBatch = await anthropic.messages.batches.create({
    requests: remainingRequests,
  });

  console.log(`✅ Batch created! ID: ${messageBatch.id}`);

  const activeBatchPath = path.join(__dirname, "active-batch.json");
  fs.writeFileSync(
    activeBatchPath,
    JSON.stringify({ batchId: messageBatch.id }, null, 2),
  );
  console.log(`💾 Saved batch ID locally to: active-batch.json`);

  console.log("\n" + "=".repeat(50));
  console.log("🎉 BATCH CLAUDE SUBMETIDO COM CACHE AQUECIDO!");
  console.log("=".repeat(50));
  console.log(`🆔 ID do Batch: ${messageBatch.id}`);

  console.log("\n⏳ O QUE FAZER AGORA?");
  console.log("👉 COMANDO DE CONSUMO:");
  console.log(
    `\x1b[32mnpx tsx src/server/db/scripts/enrichment-validate/claude/consume-enrichment-batch.ts\x1b[0m`,
  );
  console.log("=".repeat(50) + "\n");
}

main().catch((err) => {
  console.error("❌ Error submitting batch:", err);
  process.exit(1);
});
