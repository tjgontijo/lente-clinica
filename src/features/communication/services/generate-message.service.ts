import "server-only";
import { findSessionForMessageRepository } from "../repositories/find-session-for-message.repository";
import { findTemplateByScenarioRepository } from "../repositories/find-template-by-scenario.repository";
import { listActiveMedicationsForCaseRepository } from "../repositories/list-active-medications-for-case.repository";
import { generateMessageSchema } from "../schemas/generate-message.schema";

export async function generateMessageService(userId: string, input: unknown) {
  const validatedInput = generateMessageSchema.parse(input);

  // 1. Buscar Sessão e Case via Repository
  const sessionData = await findSessionForMessageRepository(
    validatedInput.sessionId,
  );

  if (!sessionData || sessionData.patientCase.userId !== userId) {
    throw new Error("Sessão não encontrada ou acesso negado.");
  }

  const pCase = sessionData.patientCase;

  // 2. Buscar Medicações Ativas via Repository
  const activeMedications = await listActiveMedicationsForCaseRepository(
    pCase.id,
  );

  // 3. Buscar Template via Repository
  const template = await findTemplateByScenarioRepository(
    validatedInput.scenarioId,
  );
  if (!template) {
    throw new Error("Template não encontrado.");
  }

  // 4. Lógica de Substituição (Parser)
  let content = "";
  if (validatedInput.format === "SHORT") content = template.contentShort;
  else if (validatedInput.format === "MEDIUM")
    content = template.contentMedium || template.contentShort;
  else
    content =
      template.contentFormal || template.contentMedium || template.contentShort;

  const age = pCase.birthYear
    ? new Date().getFullYear() - pCase.birthYear
    : "[idade]";
  const symptoms = sessionData.observations
    .map((o) => o.symptom.name)
    .join(", ");
  const meds = activeMedications.map((pm) => pm.medication.name).join(", ");

  const finalMessage = content
    .replace(/\[nome\]/g, pCase.firstName)
    .replace(/\[idade\]/g, age.toString())
    .replace(/\[sintomas\]/g, symptoms || "[sintomas não informados]")
    .replace(/\[medicação\]/g, meds || "[sem medicação informada]");

  return {
    message: finalMessage,
    urgencyLevel: template.urgencyLevel,
  };
}
