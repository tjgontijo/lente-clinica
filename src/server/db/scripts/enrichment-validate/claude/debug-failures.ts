import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";
import { medicationEnrichmentSchema } from "@/features/medications/schemas/medication-enrichment.schema";

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set.");
  }

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const batchId = "msgbatch_017DEUStKgVhWv25CPuovW8p";
  console.log(`🔍 Checking all batch results for schema compliance...`);

  const resultsResponse = await anthropic.messages.batches.results(batchId);

  // Load slug mapping
  let slugMapping: Record<string, string> = {};
  const mappingPath = path.join(__dirname, "active-batch-mapping.json");
  if (fs.existsSync(mappingPath)) {
    slugMapping = JSON.parse(fs.readFileSync(mappingPath, "utf-8"));
  }

  for await (const item of resultsResponse) {
    const slug = slugMapping[item.custom_id] || item.custom_id;

    if (item.result.type !== "succeeded") {
      continue;
    }

    const message = item.result.message;
    const toolUseBlock = message.content.find(
      (c: any) => c.type === "tool_use",
    );
    if (!toolUseBlock) {
      continue;
    }
    const parsed = { ...(toolUseBlock as any).input } as any;

    // Apply auto-healer
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
            console.log(`✅ Success auto-healing field "${field}" for ${slug}`);
          } catch (e: any) {
            console.error(
              `❌ SyntaxError parsing field "${field}" for ${slug}:`,
              e.message,
            );
            // Let's print the string to see what it is
            console.log(`String value:`, trimmed);
          }
        }
      }
    }

    try {
      medicationEnrichmentSchema.parse(parsed);
    } catch (err: any) {
      console.log(`\n❌ SCHEMA VALIDATION FAILED FOR: ${slug}`);
      console.log(`Issues:`, JSON.stringify(err.issues || err, null, 2));
    }
  }
}

main().catch(console.error);
