import "dotenv/config";
import { listMedicationsForEnrichmentRepository } from "@/features/medications/repositories/list-medications-for-enrichment.repository";
import { markMedicationEnrichmentFailedRepository } from "@/features/medications/repositories/mark-medication-enrichment-failed.repository";
import { updateMedicationEnrichmentDraftRepository } from "@/features/medications/repositories/update-medication-enrichment-draft.repository";
import { enrichMedicationWithLlm } from "@/features/medications/services/enrich-medication-with-llm.service";
import { validateMedicationEnrichmentSafety } from "@/features/medications/services/validate-medication-enrichment.service";

// Helper to parse CLI arguments
const args = process.argv.slice(2);

function getArgValue(name: string): string | undefined {
  const arg = args.find((a) => a.startsWith(`--${name}=`));
  if (arg) return arg.split("=")[1];
  const idx = args.indexOf(`--${name}`);
  if (idx !== -1 && idx + 1 < args.length) return args[idx + 1];
  return undefined;
}

const limitArg = getArgValue("limit");
const limit = limitArg ? parseInt(limitArg, 10) : undefined;
const dryRun = args.includes("--dry-run");
const force = args.includes("--force");
const only = getArgValue("only");

async function main() {
  if (!process.env.OPENAI_API_KEY && !dryRun) {
    console.error("❌ Error: OPENAI_API_KEY is not set.");
    process.exit(1);
  }

  console.log(`🚀 Starting medication enrichment batch...`);
  console.log(
    `   Options: limit=${limit || "unlimited"}, dryRun=${dryRun}, force=${force}, only=${only || "all"}`,
  );

  const medications = await listMedicationsForEnrichmentRepository({
    limit,
    force,
    only: only === "all" ? undefined : only,
  });
  console.log(`   Found ${medications.length} medications to process.`);

  let processed = 0;
  let success = 0;
  let failed = 0;

  for (const med of medications) {
    processed++;
    console.log(
      `\n[${processed}/${medications.length}] Processing: ${med.name}...`,
    );

    try {
      const enrichmentData = {
        medicationName: med.name,
        classCode: med.class.name,
        classDescription: med.class.description || "",
        productNames: med.products.map((p) => p.productName).join(", "),
        productTypes: Array.from(
          new Set(
            med.products.map((p) => p.productType).filter(Boolean) as string[],
          ),
        ).join(", "),
        regulatoryLabels: Array.from(
          new Set(
            med.products
              .map((p) => p.regulatoryLabel)
              .filter(Boolean) as string[],
          ),
        ).join(", "),
      };

      if (dryRun) {
        console.log(`   [DRY RUN] Would call LLM for ${med.name}`);
        console.log(`   Data:`, JSON.stringify(enrichmentData, null, 2));
        success++;
        continue;
      }

      console.log(`   📝 Calling LLM with data:`, JSON.stringify(enrichmentData, null, 2));
      const result = await enrichMedicationWithLlm(enrichmentData);

      if (result.error || !result.data) {
        console.error(`   ❌ LLM Error: ${result.error}`);
        console.log(`   Raw Result:`, JSON.stringify(result, null, 2));
        await markMedicationEnrichmentFailedRepository(
          med.id,
          result.error || "Unknown LLM error",
        );
        failed++;
        continue;
      }

      console.log(`   ✨ LLM Response:`, JSON.stringify(result.data, null, 2));
      if (result.usage) {
        const cached = result.usage.cachedTokens
          ? ` (Cached: ${result.usage.cachedTokens})`
          : "";
        console.log(
          `   📊 Usage: ${result.usage.totalTokens} tokens (In: ${result.usage.promptTokens}${cached}, Out: ${result.usage.completionTokens})`,
        );
      }

      const safety = validateMedicationEnrichmentSafety(result.data);
      if (!safety.valid) {
        console.warn(`   ⚠️ Safety check failed: ${safety.issues.join(", ")}`);
        await markMedicationEnrichmentFailedRepository(
          med.id,
          `Safety check failed: ${safety.issues.join(", ")}`,
        );
        failed++;
        continue;
      }

      await updateMedicationEnrichmentDraftRepository(med.id, result.data, {
        model: result.model,
        promptVersion: result.promptVersion,
      });

      console.log(`   ✅ Success: Saved as NEEDS_REVIEW`);
      success++;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(`   ❌ Unexpected error: ${errorMessage}`);
      if (!dryRun) {
        await markMedicationEnrichmentFailedRepository(med.id, errorMessage);
      }
      failed++;
    }
  }

  console.log(`\n🏁 Batch finished.`);
  console.log(`   Total: ${medications.length}`);
  console.log(`   Processed: ${processed}`);
  console.log(`   Success: ${success}`);
  console.log(`   Failed: ${failed}`);
}

main().catch((err) => {
  console.error("❌ Fatal error:");
  console.error(err);
  process.exit(1);
});
