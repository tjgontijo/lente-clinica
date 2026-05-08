import "dotenv/config";
import { db } from "@/server/db/db";
import { medication } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";
import {
  MEDICATION_ENRICHMENT_STATIC_PROMPT,
  getMedicationEnrichmentData,
  MEDICATION_ENRICHMENT_PROMPT_VERSION,
} from "@/features/medications/prompts/medication-enrichment.prompt";

const MODEL = "gpt-5.4";
const MAX_COMPLETION_TOKENS = 2200;

async function main() {
  console.log("🚀 Generating medication enrichment batch file...");

  // 1. Buscar medicamentos elegíveis com seus produtos (LIMITADO PARA TESTE)
  const medicationsToEnrich = await db.query.medication.findMany({
    where: and(
      eq(medication.shouldEnrichWithLlm, true),
      eq(medication.enrichmentStatus, "PENDING")
    ),
    with: {
      class: true,
      products: true,
    },
    limit: 2,
  });

  if (medicationsToEnrich.length === 0) {
    console.log("✅ No medications pending enrichment.");
    return;
  }

  console.log(`📦 Found ${medicationsToEnrich.length} medications to process.`);

  const batchLines: string[] = [];

  // Helper para gerar schema de array de strings com limites
  const stringArray = (minItems: number, maxItems: number, maxLength: number) => ({
    type: "array",
    minItems,
    maxItems,
    items: {
      type: "string",
      maxLength,
    },
  });

  // 2. Definir o JSON Schema (Structured Outputs - Strict)
  const jsonSchema = {
    name: "medication_enrichment",
    strict: true,
    schema: {
      type: "object",
      additionalProperties: false,
      required: [
        "description",
        "clinicalContexts",
        "patientReports",
        "careObservations",
        "clinicalConfounders",
        "usefulQuestions",
        "coordinationNotes",
        "attentionSignals",
        "clinicalPhrase",
      ],
      properties: {
        description: {
          type: "string",
          minLength: 80,
          maxLength: 700,
        },
        clinicalContexts: stringArray(3, 6, 180),
        patientReports: stringArray(4, 7, 180),
        careObservations: stringArray(4, 7, 240),
        clinicalConfounders: stringArray(4, 7, 280),
        usefulQuestions: stringArray(5, 8, 220),
        coordinationNotes: stringArray(3, 6, 260),
        attentionSignals: stringArray(3, 6, 260),
        clinicalPhrase: {
          type: "string",
          minLength: 1,
          maxLength: 180,
        },
      },
    },
  };

  for (const med of medicationsToEnrich) {
    const productNames = Array.from(new Set(med.products.map(p => p.productName))).join(", ");
    const productTypes = Array.from(new Set(med.products.map(p => p.productType).filter(Boolean))).join(", ");
    const regulatoryLabels = Array.from(new Set(med.products.map(p => p.regulatoryLabel).filter(Boolean))).join(", ");

    // Extrair código da classe de forma robusta
    const className = med.class?.name || "N/A";
    const classMatch = className.match(/^([A-Z0-9]+)/);
    const classCode = classMatch ? classMatch[1] : "N/A";

    const enrichmentData = {
      medicationName: med.name,
      classCode,
      classDescription: className,
      productNames: productNames || "N/A",
      productTypes: productTypes || "N/A",
      regulatoryLabels: regulatoryLabels || "N/A",
    };

    const request = {
      custom_id: `medication-enrichment:${med.id}`,
      method: "POST",
      url: "/v1/chat/completions",
      body: {
        model: MODEL,
        messages: [
          {
            role: "system",
            content: MEDICATION_ENRICHMENT_STATIC_PROMPT,
          },
          {
            role: "user",
            content: `Dados do medicamento para esta ficha:\n${JSON.stringify(getMedicationEnrichmentData(enrichmentData as any), null, 2)}`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: jsonSchema,
        },
        temperature: 0.2,
        max_completion_tokens: MAX_COMPLETION_TOKENS,
      },
    };

    batchLines.push(JSON.stringify(request));
  }

  // 3. Salvar o arquivo .jsonl
  const fileName = `enrichment_batch_${Date.now()}.jsonl`;
  const filePath = path.join(process.cwd(), fileName);
  fs.writeFileSync(filePath, batchLines.join("\n") + "\n");

  console.log(`\n✅ Batch file generated: ${fileName}`);
  console.log(`📂 Total lines: ${batchLines.length}`);
  console.log(`\nPróximo passo: suba este arquivo para a OpenAI via dashboard ou use 'npm run enrich:medications:batch:submit'.`);
}

main().catch((err) => {
  console.error("❌ Error generating batch:", err);
  process.exit(1);
});
