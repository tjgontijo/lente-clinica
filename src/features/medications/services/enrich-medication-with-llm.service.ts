import OpenAI from "openai";
import {
  getMedicationEnrichmentPrompt,
  getMedicationEnrichmentData,
  MEDICATION_ENRICHMENT_PROMPT_VERSION,
  MEDICATION_ENRICHMENT_STATIC_PROMPT,
} from "@/features/medications/prompts/medication-enrichment.prompt";
import type { MedicationEnrichment } from "@/features/medications/schemas/medication-enrichment.schema";
import { medicationEnrichmentSchema } from "@/features/medications/schemas/medication-enrichment.schema";

const MODEL = "gpt-5.4";

export interface EnrichMedicationResult {
  data?: MedicationEnrichment;
  model: string;
  promptVersion: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    cachedTokens?: number;
  };
  error?: string;
}

export async function enrichMedicationWithLlm(data: {
  medicationName: string;
  classCode?: string;
  classDescription?: string;
  productNames: string;
  productTypes: string;
  regulatoryLabels: string;
}): Promise<EnrichMedicationResult> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: MEDICATION_ENRICHMENT_STATIC_PROMPT,
        },
        {
          role: "user",
          content: `Gere a ficha para este medicamento:\n${JSON.stringify(getMedicationEnrichmentData(data), null, 2)}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from OpenAI");
    }

    const parsed = JSON.parse(content);
    const validated = medicationEnrichmentSchema.parse(parsed);

    return {
      data: validated,
      model: MODEL,
      promptVersion: MEDICATION_ENRICHMENT_PROMPT_VERSION,
      usage: response.usage
        ? {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens,
          cachedTokens: (response.usage as any).prompt_tokens_details
            ?.cached_tokens,
        }
        : undefined,
    };
  } catch (error: unknown) {
    console.error("Error enriching medication:", error);
    return {
      model: MODEL,
      promptVersion: MEDICATION_ENRICHMENT_PROMPT_VERSION,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
