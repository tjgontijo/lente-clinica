import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set.");
  }

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

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

  if (!batchId || batchId === "none_primed_only") {
    console.error("❌ No active batch ID found to check.");
    process.exit(1);
  }

  console.log(`🔍 Fetching batch results for ID: ${batchId}...`);
  const resultsResponse = await anthropic.messages.batches.results(batchId);

  console.log("\n==================================================");
  console.log("📊 BATCH USAGE & CACHE STATS");
  console.log("==================================================");

  let totalInput = 0;
  let totalOutput = 0;
  let totalCacheRead = 0;
  let totalCacheWrite = 0;
  let count = 0;

  for await (const item of resultsResponse) {
    const customId = item.custom_id;
    if (item.result.type !== "succeeded") {
      console.log(`❌ Item [${customId}] failed: ${item.result.type}`);
      continue;
    }

    const usage = item.result.message.usage;
    console.log(`\n📦 Item: ${customId}`);
    console.log(`   - Input Tokens (Non-Cached): ${usage.input_tokens}`);
    console.log(
      `   - Cache Read Input Tokens:   \x1b[32m${usage.cache_read_input_tokens}\x1b[0m`,
    );
    console.log(
      `   - Cache Write Input Tokens:  ${usage.cache_creation_input_tokens || 0}`,
    );
    console.log(`   - Output Tokens Generated:   ${usage.output_tokens}`);

    totalInput += usage.input_tokens;
    totalOutput += usage.output_tokens;
    totalCacheRead += usage.cache_read_input_tokens || 0;
    totalCacheWrite += usage.cache_creation_input_tokens || 0;
    count++;
  }

  console.log("\n==================================================");
  console.log("📈 ACCUMULATED TOTALS FOR THE BATCH ITEMS");
  console.log("==================================================");
  console.log(`Items count:             ${count}`);
  console.log(`Total Non-Cached Input:  ${totalInput} tokens`);
  console.log(
    `Total Cache Reads (SAVED!): \x1b[32m${totalCacheRead} tokens\x1b[0m`,
  );
  console.log(`Total Cache Writes:      ${totalCacheWrite} tokens`);
  console.log(`Total Output Generated:  ${totalOutput} tokens`);
  console.log("==================================================\n");
}

main().catch((err) => {
  console.error("❌ Error checking stats:", err);
});
