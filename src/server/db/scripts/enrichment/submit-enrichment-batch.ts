import "dotenv/config";
import { and, eq, inArray } from "drizzle-orm";
import * as fs from "fs";
import OpenAI from "openai";
import * as path from "path";
import { db } from "@/server/db/db";
import { medication } from "@/server/db/schema";

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
    console.error(
      "❌ No batch file found. Run 'npm run enrich:medications:batch:generate' first.",
    );
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

  console.log(
    `💾 Updating ${medicationIds.length} medications to PENDING_BATCH...`,
  );

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
        eq(medication.enrichmentStatus, "PENDING"),
      ),
    );

  console.log("\n" + "=".repeat(50));
  console.log("🎉 BATCH DE ENRIQUECIMENTO SUBMETIDO!");
  console.log("=".repeat(50));
  console.log(`\n🆔 ID do Batch: ${batch.id}`);
  console.log(
    `📋 Status:      https://platform.openai.com/batches/${batch.id}`,
  );
  console.log(`📂 Arquivo:     ${fileName}`);
  console.log(`📊 Itens:       ${medicationIds.length} medicamentos`);

  console.log("\n⏳ O QUE FAZER AGORA?");
  console.log("1. Aguarde a OpenAI processar (pode levar de 10 min a 24h).");
  console.log("2. Quando o status estiver 'completed', rode o comando abaixo:");
  console.log("\n👉 COMANDO DE CONSUMO:");
  console.log(
    `\x1b[32mnpm run enrich:medications:batch:consume -- ${batch.id}\x1b[0m`,
  );
  console.log("=".repeat(50) + "\n");
}

main().catch((err) => {
  console.error("❌ Error submitting batch:", err);
  process.exit(1);
});
