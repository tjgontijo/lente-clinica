import "dotenv/config";
import fs from "fs";
import OpenAI from "openai";

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error(
      "❌ Por favor, forneça o caminho do arquivo JSONL: npx tsx src/server/db/scripts/relevance/submit-relevance-batch.ts <file_path>",
    );
    process.exit(1);
  }

  const openai = new OpenAI();
  console.log(`📤 Enviando arquivo para OpenAI: ${filePath}...`);

  const file = await openai.files.create({
    file: fs.createReadStream(filePath),
    purpose: "batch",
  });

  console.log(`✅ Arquivo enviado! ID: ${file.id}`);
  console.log(`🚀 Iniciando batch job...`);

  const batch = await openai.batches.create({
    input_file_id: file.id,
    endpoint: "/v1/chat/completions",
    completion_window: "24h",
  });

  console.log("\n" + "=".repeat(50));
  console.log("🎉 BATCH SUBMETIDO COM SUCESSO!");
  console.log("=".repeat(50));
  console.log(`\n🆔 ID do Batch: ${batch.id}`);
  console.log(
    `📋 Status:      https://platform.openai.com/batches/${batch.id}`,
  );

  console.log("\n⏳ O QUE FAZER AGORA?");
  console.log("1. Aguarde a OpenAI processar (pode levar de 10 min a 24h).");
  console.log("2. Quando o status estiver 'completed', rode o comando abaixo:");
  console.log("\n👉 COMANDO DE CONSUMO:");
  console.log(
    `\x1b[32mnpx tsx src/server/db/scripts/relevance/consume-relevance-batch.ts ${batch.id}\x1b[0m`,
  );
  console.log("=".repeat(50) + "\n");
}

main().catch(console.error);
