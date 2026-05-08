import "dotenv/config";
import fs from "fs";
import { db } from "../db";
import { medication, medicationClass } from "../schema";
import { eq, isNull } from "drizzle-orm";

const RELEVANCE_STATIC_PROMPT = `Você está classificando a relevância de um medicamento para uma plataforma de apoio clínico a profissionais que acompanham pacientes medicados em saúde mental.

A tarefa é estimar o quanto esse medicamento merece aparecer, ser priorizado ou receber ficha clínica na plataforma.

A classificação deve considerar:
1. relevância direta para saúde mental, comportamento, sono, cognição, humor, ansiedade, risco suicida, impulsividade, sedação, ativação ou adesão;
2. relevância indireta por tratar condições que podem mimetizar, agravar ou confundir sintomas de saúde mental;
3. relevância pelo contexto de cuidado, como doença crônica, doença neurológica, condição rara, tratamento complexo, impacto familiar, funcionalidade ou acompanhamento multiprofissional;
4. potencial de gerar relatos importantes no atendimento, como fadiga, alteração de sono, apetite, libido, peso, cognição, dor, agitação, confusão, medo, estigma ou dificuldade de adesão.

CRITÉRIOS DE SCORE:
- 10: Psicofármacos centrais ou medicamentos altamente relevantes para manejo de saúde mental.
- 8-9: Medicamentos com impacto neuropsiquiátrico, cognitivo, comportamental, sono/vigília, risco, sedação, ativação ou alto potencial de confundir o acompanhamento.
- 6-7: Medicamentos ou condições tratadas com impacto indireto importante em humor, energia, cognição, ansiedade, sono, adesão, funcionalidade ou qualidade de vida.
- 4-5: Medicamentos de uso crônico com relevância moderada para acompanhamento, adesão, estilo de vida, sintomas físicos ou contexto clínico.
- 0-3: Medicamentos periféricos, sintomáticos agudos ou com baixa relação prática com acompanhamento em saúde mental.

Regras:
- Não avalie se o medicamento é bom ou ruim.
- Não prescreva.
- Não sugira conduta.
- Não invente detalhes específicos quando houver incerteza.
- Use a classe terapêutica fornecida como pista, mas não dependa apenas dela.
- Seja conservador: quando a relevância for incerta, escolha score intermediário e explique a incerteza.
- A justificativa deve ser curta e útil para decisão de priorização.`;

const medicationRelevanceJsonSchema = {
  name: "medication_relevance",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["score", "reason", "category"],
    properties: {
      score: {
        type: "integer",
        minimum: 0,
        maximum: 10,
      },
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
      reason: {
        type: "string",
        maxLength: 240,
      },
    },
  },
};

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
    .where(isNull(medication.mentalHealthCategory));

  if (medications.length === 0) {
    console.log("✨ Todos os medicamentos já foram analisados!");
    return;
  }

  const jsonlLines = medications.map((med) => {
    return JSON.stringify({
      custom_id: `medication-relevance:${med.id}`,
      method: "POST",
      url: "/v1/chat/completions",
      body: {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: RELEVANCE_STATIC_PROMPT,
          },
          {
            role: "user",
            content: JSON.stringify({
              medicationName: med.name,
              className: med.className,
              classDescription: med.classDescription,
            }),
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: medicationRelevanceJsonSchema,
        },
        temperature: 0,
      },
    });
  });

  const fileName = `relevance_batch_${Date.now()}.jsonl`;
  fs.writeFileSync(fileName, jsonlLines.join("\n") + "\n");

  console.log(
    `✅ Gerado arquivo de batch para análise de relevância: ${fileName}`,
  );
  console.log(`📊 Total de medicamentos para analisar: ${medications.length}`);
}

main().catch(console.error);
