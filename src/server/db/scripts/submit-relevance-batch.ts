import "dotenv/config";
import fs from "fs";
import OpenAI from "openai";

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("❌ Por favor, forneça o caminho do arquivo JSONL: npx tsx src/server/db/scripts/submit-relevance-batch.ts <file_path>");
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

  console.log(`\n🎉 Batch iniciado com sucesso!`);
  console.log(`🆔 ID do Batch: ${batch.id}`);
  console.log(`📋 Monitore o status em: https://platform.openai.com/batches/${batch.id}`);
  console.log(`\n💡 Quando terminar, rode o script de consumo:`);
  console.log(`   npx tsx src/server/db/scripts/consume-relevance-batch.ts ${batch.id}`);
}

main().catch(console.error);
