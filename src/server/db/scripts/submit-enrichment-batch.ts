import "dotenv/config";
import OpenAI from "openai";
import { db } from "@/server/db/db";
import { medication } from "@/server/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

const CUSTOM_ID_PREFIX = "medication-enrichment:";

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set.");
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // 1. Localizar o arquivo .jsonl (por argumento ou mais recente)
  const files = fs
    .readdirSync(process.cwd())
    .filter((f) => f.startsWith("enrichment_batch_") && f.endsWith(".jsonl"));

  const argFileName = process.argv[2];
  const fileName = argFileName ?? files.sort().reverse()[0];

  if (!fileName) {
    console.error("❌ No batch file found. Run 'npm run enrich:medications:batch:generate' first.");
    process.exit(1);
  }

  const filePath = path.join(process.cwd(), fileName);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Batch file not found: ${filePath}`);
  }

  console.log(`🚀 Uploading batch file: ${fileName}...`);

  // 2. Upload do arquivo
  const file = await openai.files.create({
    file: fs.createReadStream(filePath),
    purpose: "batch",
  });

  console.log(`✅ File uploaded! ID: ${file.id}`);

  // 3. Criar o Batch
  console.log("📦 Creating OpenAI Batch...");
  const batch = await openai.batches.create({
    input_file_id: file.id,
    endpoint: "/v1/chat/completions",
    completion_window: "24h",
  });

  console.log(`✅ Batch created! ID: ${batch.id}`);

  // 4. Ler o arquivo para saber quais IDs de medicamentos marcar
  const content = fs.readFileSync(filePath, "utf-8");
  const medicationIds = content
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const json = JSON.parse(line);

      if (!json.custom_id?.startsWith(CUSTOM_ID_PREFIX)) {
        throw new Error(`Invalid custom_id: ${json.custom_id}`);
      }

      return json.custom_id.replace(CUSTOM_ID_PREFIX, "");
    });

  console.log(`💾 Updating ${medicationIds.length} medications to PENDING_BATCH...`);

  // 5. Atualizar no banco (apenas os que ainda estão PENDING)
  await db
    .update(medication)
    .set({
      enrichmentStatus: "PENDING_BATCH",
      enrichmentBatchId: batch.id,
      enrichmentError: null,
    })
    .where(
      and(
        inArray(medication.id, medicationIds),
        eq(medication.enrichmentStatus, "PENDING")
      )
    );

  console.log("✨ All set! Now check the batch status later.");
  console.log(`Batch ID: ${batch.id}`);
  console.log(`Use 'npm run enrich:medications:batch:consume' later to import results.`);
}

main().catch((err) => {
  console.error("❌ Error submitting batch:", err);
  process.exit(1);
});
