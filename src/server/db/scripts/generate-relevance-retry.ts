import "dotenv/config";
import fs from "fs";
import { db } from "../db";
import { medication, medicationClass } from "../schema";
import { eq, inArray } from "drizzle-orm";

const RELEVANCE_STATIC_PROMPT = `Você está classificando a relevância de um medicamento para uma plataforma de apoio clínico a profissionais que acompanham pacientes medicados em saúde mental.
Seja conciso na justificativa (máximo 200 caracteres).

CRITÉRIOS DE SCORE:
- 10: Psicofármacos centrais.
- 8-9: Impacto neuropsiquiátrico/cognitivo/comportamental direto.
- 6-7: Impacto indireto importante (humor, energia, tireoide, sono).
- 4-5: Uso crônico, relevância moderada.
- 0-3: Baixa relação prática com saúde mental.`;

const medicationRelevanceJsonSchema = {
  name: "medication_relevance",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["score", "reason", "category"],
    properties: {
      score: { type: "integer", minimum: 0, maximum: 10 },
      category: {
        type: "string",
        enum: [
          "direct_mental_health",
          "neuropsychiatric_or_behavioral_relevance",
          "medical_condition_affecting_mental_health",
          "chronic_care_context",
          "low_relevance",
        ],
      },
      reason: { type: "string", maxLength: 240 },
    },
  },
};

const FAILED_IDS = [
  "19cb5f37-9fed-42ec-bb56-ce9d5a8bb1b8",
  "d1c5dda3-7559-4830-b744-b10d6d579be3",
  "ab695069-7337-4500-a1e4-4a46c9b65d77",
  "c4bc7dad-9d1d-4981-9916-82e632951bf4",
  "652707bf-79f7-43cf-aefa-cd56d0cccb89",
  "ba28ff5d-0c2b-4e2f-add2-943ba22930a7",
  "c01dc60f-c710-4760-ba26-04c81cff75b1",
  "2e9c27d9-d14a-4670-a256-8b4c1606f1a8",
  "42dbcaae-f93d-49fd-a414-cd72f1a151ab",
  "314eb63b-777a-4a4e-9d87-c205d8738679",
  "7f01c066-2e78-4c6d-a32f-4664effcdadd",
  "9d3d2708-44a0-44d9-8659-62896fe381f2",
  "f81ca5a5-a019-4d27-85c0-b830461fa24b",
  "9ab29f34-1bd5-4c8e-9267-a58db532d3e5",
  "29bb1829-3a33-4ee0-a7ec-dcb7a914f9fb",
];

async function main() {
  const medications = await db
    .select({
      id: medication.id,
      name: medication.name,
      className: medicationClass.name,
      classDescription: medicationClass.description,
    })
    .from(medication)
    .innerJoin(medicationClass, eq(medication.classId, medicationClass.id))
    .where(inArray(medication.id, FAILED_IDS));

  const jsonlLines = medications.map((med) => {
    return JSON.stringify({
      custom_id: `medication-relevance-retry:${med.id}`,
      method: "POST",
      url: "/v1/chat/completions",
      body: {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: RELEVANCE_STATIC_PROMPT },
          {
            role: "user",
            content: `Medicamento: ${med.name}, Classe: ${med.className}`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: medicationRelevanceJsonSchema,
        },
        temperature: 0,
        max_tokens: 500,
      },
    });
  });

  const fileName = `relevance_retry_batch_${Date.now()}.jsonl`;
  fs.writeFileSync(fileName, jsonlLines.join("\n") + "\n");
  console.log(`✅ Gerado arquivo de retry para 15 medicamentos: ${fileName}`);
}

main().catch(console.error);
