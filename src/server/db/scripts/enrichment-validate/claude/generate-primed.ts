import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import { eq } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";
import { medicationEnrichmentSchema } from "@/features/medications/schemas/medication-enrichment.schema";
import { db } from "@/server/db/db";
import { medication } from "@/server/db/schema";
import {
  getMedicationEnrichmentData,
  MEDICATION_ENRICHMENT_STATIC_PROMPT,
} from "../prompt";

const MODEL = "claude-sonnet-4-6";
const MAX_TOKENS = 4000;

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set.");
  }

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  console.log("🔍 Fetching betainterferona_1b from database...");
  const medications = await db.query.medication.findMany({
    with: {
      class: true,
      products: true,
    },
  });

  const med = medications.find((m) => {
    const slugName = m.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9_-]/g, "_");
    return slugName === "betainterferona_1b";
  });

  if (!med) {
    console.error("❌ Medication betainterferona_1b not found in database.");
    return;
  }

  console.log(`✅ Found medication: ${med.name}`);

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

  console.log(
    "🔥 Generating enrichment synchronously for betainterferona_1b...",
  );
  const startTime = Date.now();

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    temperature: 0.2,
    system: [
      {
        type: "text",
        text: MEDICATION_ENRICHMENT_STATIC_PROMPT,
        cache_control: { type: "ephemeral" },
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
  });

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`✅ Request processed successfully in ${duration}s!`);

  const toolUseBlock = response.content.find((c: any) => c.type === "tool_use");
  if (!toolUseBlock || !("input" in toolUseBlock)) {
    throw new Error("No tool_use block found in response");
  }

  const parsed = { ...(toolUseBlock as any).input } as any;

  // Auto-healer: Converte campos que vieram como JSON string em arrays/objetos reais
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
        } catch (e) {
          try {
            // sanitizeSerializedJson nested implementation
            let s = trimmed;
            s = s.replace(
              /"(name|content|level|signal|action)"/g,
              "__QUOTE__$1__QUOTE__",
            );
            s = s.replace(/:\s*"/g, ": __QUOTE__");
            s = s.replace(/"\s*,\s*\n/g, "__QUOTE__,\n");
            s = s.replace(/"\s*,\s*\r\n/g, "__QUOTE__,\r\n");
            s = s.replace(/"\s*}/g, "__QUOTE__}");
            s = s.replace(/{\s*"/g, "{__QUOTE__");
            s = s.replace(/"\s*,\s*$/gm, "__QUOTE__,");
            s = s.replace(/"\s*$/gm, "__QUOTE__");
            s = s.replace(/^\s*"/gm, "  __QUOTE__");
            s = s.replace(/"/g, "'");
            s = s.replace(/__QUOTE__/g, '"');
            parsed[field] = JSON.parse(s);
          } catch (e2: any) {
            console.error(`❌ Could not parse field "${field}":`, e2.message);
          }
        }
      }
    }
  }

  const validated = medicationEnrichmentSchema.parse(parsed);
  console.log("✅ Validated betainterferona_1b successfully!");

  // Merge into calibrated_medications.json
  const outputsDir = path.join(__dirname, "outputs");
  const consolidatedFilePath = path.join(
    outputsDir,
    "calibrated_medications.json",
  );

  let consolidatedResults: Record<string, any> = {};
  if (fs.existsSync(consolidatedFilePath)) {
    consolidatedResults = JSON.parse(
      fs.readFileSync(consolidatedFilePath, "utf-8"),
    );
  }

  consolidatedResults["betainterferona_1b"] = validated;
  fs.writeFileSync(
    consolidatedFilePath,
    JSON.stringify(consolidatedResults, null, 2),
  );

  console.log(
    `💾 Successfully merged betainterferona_1b into calibrated_medications.json!`,
  );
  console.log(
    `📊 New total count: ${Object.keys(consolidatedResults).length} medicines.`,
  );
}

main().catch(console.error);
