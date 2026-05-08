import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/server/db/db";
import { communicationTemplate } from "@/server/db/schema";

export async function findTemplateByScenarioRepository(scenarioId: string) {
  return db.query.communicationTemplate.findFirst({
    where: eq(communicationTemplate.scenarioId, scenarioId),
  });
}
