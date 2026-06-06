import "dotenv/config";
import { and, eq } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";
import {
  getMedicationEnrichmentData,
  MEDICATION_ENRICHMENT_PROMPT_VERSION,
  MEDICATION_ENRICHMENT_STATIC_PROMPT,
} from "@/features/medications/prompts/medication-enrichment.prompt";
import { db } from "@/server/db/db";
import { medication } from "@/server/db/schema";

const MODEL = "gpt-5.4";
const MAX_COMPLETION_TOKENS = 2200;

async function main() {
  console.log("🚀 Generating medication enrichment batch file...");

  // 1. Buscar medicamentos elegíveis com seus produtos (LIMITADO PARA TESTE)
  const medicationsToEnrich = await db.query.medication.findMany({
    where: and(
      eq(medication.shouldEnrichWithLlm, true),
      eq(medication.enrichmentStatus, "PENDING"),
    ),
    with: {
      class: true,
      products: true,
    },
  });

  if (medicationsToEnrich.length === 0) {
    console.log("✅ No medications pending enrichment.");
    return;
  }

  console.log(`📦 Found ${medicationsToEnrich.length} medications to process.`);

  const batchLines: string[] = [];

  // Helper para gerar schema de array de strings com limites
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

  // 2. Definir o JSON Schema (Structured Outputs - Strict) - VERSÃO 5.0
  const jsonSchema = {
    name: "medication_enrichment",
    strict: true,
    schema: {
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
          minLength: 400,
          maxLength: 900,
        },
        clinicalDomains: {
          type: "array",
          minItems: 2,
          maxItems: 7,
          items: {
            type: "object",
            required: ["name", "content"],
            additionalProperties: false,
            properties: {
              name: { type: "string", maxLength: 100 },
              content: { type: "string" },
            },
          },
        },
        sessionDiscriminationQuestions: stringArray(3, 6, 300),
        communicationScenarios: stringArray(3, 6, 300),
        attentionSignals: {
          type: "array",
          minItems: 3,
          maxItems: 6,
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
          maxLength: 180,
        },
      },
    },
  };

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

  console.log("\n" + "=".repeat(50));
  console.log("🚀 BATCH DE ENRIQUECIMENTO (v5.0) GERADO");
  console.log("=".repeat(50));
  console.log(`\n📂 Arquivo: ${fileName}`);
  console.log(`📊 Itens:   ${batchLines.length} medicamentos`);
  console.log(`🏷️  Prompt:  ${MEDICATION_ENRICHMENT_PROMPT_VERSION}`);

  console.log("\n📝 Exemplo do primeiro item:");
  console.log("-".repeat(30));
  const firstItem = JSON.parse(batchLines[0]);
  console.log(`ID: ${firstItem.custom_id}`);
  console.log(
    `Substância: ${JSON.parse(firstItem.body.messages[1].content.split("ficha:\n")[1]).substance}`,
  );
  console.log("-".repeat(30));

  console.log("\n👉 PRÓXIMO PASSO:");
  console.log("Submeta este arquivo para a OpenAI rodando:");
  console.log(
    `\x1b[32mnpm run enrich:medications:batch:submit -- ./${fileName}\x1b[0m`,
  );
  console.log("=".repeat(50) + "\n");
}

main().catch((err) => {
  console.error("❌ Error generating batch:", err);
  process.exit(1);
});
