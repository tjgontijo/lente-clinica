import type { MedicationEnrichmentOutput } from "@/features/medications/schemas/medication-enrichment.schema";

const FORBIDDEN_PATTERNS = [
  /aumentar dose/i,
  /reduzir dose/i,
  /suspender/i,
  /trocar por/i,
  /iniciar/i,
  /prescrever/i,
  /tomar \d+ ?mg/i,
  /posologia/i,
  /administrar/i,
];

export interface ValidationResult {
  valid: boolean;
  issues: string[];
}

export function validateMedicationEnrichmentSafety(
  content: MedicationEnrichmentOutput,
): ValidationResult {
  const issues: string[] = [];

  const allText = [
    content.description,
    ...content.clinicalContexts,
    ...content.patientReports,
    ...content.sessionObservations,
    ...content.confoundingEffects,
    ...content.usefulQuestions,
    content.clinicalPhrase,
  ].join(" ");

  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(allText)) {
      issues.push(`Forbidden pattern found: ${pattern.source}`);
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
