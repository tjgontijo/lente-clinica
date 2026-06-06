import "dotenv/config";
import { eq } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";
import { db } from "@/server/db/db";
import { medication } from "@/server/db/schema";
import {
  getMedicationEnrichmentData,
  MEDICATION_ENRICHMENT_PROMPT_VERSION,
  MEDICATION_ENRICHMENT_STATIC_PROMPT,
} from "../prompt";

const MODEL = "claude-sonnet-4-6";
const MAX_TOKENS = 4000;

async function main() {
  console.log(
    "🚀 Generating Claude validation medication enrichment batch file...",
  );

  // 1. Buscar todos os medicamentos com a flag de enriquecimento ativa
  const medicationsToEnrich = await db.query.medication.findMany({
    where: eq(medication.shouldEnrichWithLlm, true),
    with: {
      class: true,
      products: true,
    },
  });

  if (medicationsToEnrich.length === 0) {
    console.log(
      "❌ No target medications found in the database. Check if Lithium, Fluoxetine, Propranolol, and Ocrelizumab exist.",
    );
    return;
  }

  console.log(`📦 Found ${medicationsToEnrich.length} medications to process.`);

  const batchLines: string[] = [];
  const mapping: Record<string, string> = {};

  const stringArray = (
    minItems: number,
    maxItems: number,
    maxLength: number,
  ) => ({
    type: "array",
    minItems,
    maxItems,
    items: {
      type: "string",
      maxLength,
    },
  });

  const inputSchema = {
    type: "object",
    additionalProperties: false,
    required: [
      "description",
      "clinicalDomains",
      "sessionDiscriminationQuestions",
      "communicationScenarios",
      "attentionSignals",
      "clinicalPhrase",
    ],
    properties: {
      description: {
        type: "string",
        minLength: 300,
        maxLength: 3000,
      },
      clinicalDomains: {
        type: "array",
        minItems: 1,
        maxItems: 10,
        items: {
          type: "object",
          required: ["name", "content"],
          additionalProperties: false,
          properties: {
            name: { type: "string", maxLength: 200 },
            content: { type: "string" },
          },
        },
      },
      sessionDiscriminationQuestions: stringArray(2, 10, 300),
      communicationScenarios: stringArray(2, 10, 300),
      attentionSignals: {
        type: "array",
        minItems: 2,
        maxItems: 10,
        items: {
          type: "object",
          required: ["level", "signal", "action"],
          additionalProperties: false,
          properties: {
            level: { type: "string", enum: ["amarelo", "vermelho"] },
            signal: { type: "string" },
            action: { type: "string" },
          },
        },
      },
      clinicalPhrase: {
        type: "string",
        minLength: 1,
        maxLength: 400,
      },
    },
  };

  const tools: any[] = [
    {
      name: "generate_medication_enrichment",
      description: "Gera a ficha clínica estruturada para o manual.",
      input_schema: inputSchema,
    },
  ];

  for (const med of medicationsToEnrich) {
    const productNames = Array.from(
      new Set(med.products.map((p) => p.productName)),
    ).join(", ");
    const productTypes = Array.from(
      new Set(med.products.map((p) => p.productType).filter(Boolean)),
    ).join(", ");
    const regulatoryLabels = Array.from(
      new Set(med.products.map((p) => p.regulatoryLabel).filter(Boolean)),
    ).join(", ");

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

    const slugName = med.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9_-]/g, "_");
    const customId = `med_${med.id}`;
    mapping[customId] = slugName;

    const request = {
      custom_id: customId,
      params: {
        model: MODEL,
        max_tokens: MAX_TOKENS,
        temperature: 0.2,
        system: [
          {
            type: "text" as const,
            text: MEDICATION_ENRICHMENT_STATIC_PROMPT,
            cache_control: { type: "ephemeral" as const },
          },
        ],
        messages: [
          {
            role: "user",
            content: `Dados do medicamento para esta ficha:\n${JSON.stringify(getMedicationEnrichmentData(enrichmentData as any), null, 2)}`,
          },
        ],
        tools: tools,
        tool_choice: { type: "tool", name: "generate_medication_enrichment" },
      },
    };

    batchLines.push(JSON.stringify(request));
  }

  // Salvar mapeamento de IDs de custom_id para slugs
  const mappingPath = path.join(__dirname, "active-batch-mapping.json");
  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
  console.log(`🗺️ Saved active-batch-mapping.json for slug resolution.`);

  const fileName = `claude_enrichment_batch_${Date.now()}.jsonl`;
  const filePath = path.join(process.cwd(), fileName);
  fs.writeFileSync(filePath, batchLines.join("\n") + "\n");

  console.log("\n" + "=".repeat(50));
  console.log("🚀 BATCH DE ENRIQUECIMENTO CLAUDE GERADO");
  console.log("=".repeat(50));
  console.log(`\n📂 Arquivo: ${fileName}`);
  console.log(`📊 Itens:   ${batchLines.length} medicamentos`);

  console.log("\n👉 PRÓXIMO PASSO:");
  console.log("Submeta este arquivo para a Anthropic rodando:");
  console.log(
    `\x1b[32mnpx tsx src/server/db/scripts/enrichment-validate/claude/submit-enrichment-batch.ts ${fileName}\x1b[0m`,
  );
  console.log("=".repeat(50) + "\n");
}

main().catch((err) => {
  console.error("❌ Error generating batch:", err);
  process.exit(1);
});
