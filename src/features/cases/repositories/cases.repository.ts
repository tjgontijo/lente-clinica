import { eq } from "drizzle-orm";
import { db } from "@/server/db/db";
import { patientCase, patientMedication } from "@/server/db/schema";
import type {
  CreateCaseInput,
  LinkMedicationInput,
} from "../schemas/cases.schema";

export const casesRepository = {
  async create(userId: string, data: CreateCaseInput) {
    const [result] = await db
      .insert(patientCase)
      .values({
        userId,
        initials: data.initials,
        birthYear: data.birthYear,
      })
      .returning();
    return result;
  },

  async listByUser(userId: string) {
    return db.query.patientCase.findMany({
      where: eq(patientCase.userId, userId),
      orderBy: (cases, { desc }) => [desc(cases.createdAt)],
      with: {
        medications: {
          with: {
            medication: true,
          },
        },
      },
    });
  },

  async linkMedication(data: LinkMedicationInput) {
    const [result] = await db
      .insert(patientMedication)
      .values({
        caseId: data.caseId,
        medicationId: data.medicationId,
        isCurrent: data.isCurrent,
      })
      .onConflictDoUpdate({
        target: [patientMedication.caseId, patientMedication.medicationId],
        set: { isCurrent: data.isCurrent },
      })
      .returning();
    return result;
  },

  async findById(id: string) {
    return db.query.patientCase.findFirst({
      where: eq(patientCase.id, id),
    });
  },
};
