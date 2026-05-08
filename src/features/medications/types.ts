import type { medication, medicationClass } from "@/server/db/schema";

export type Medication = typeof medication.$inferSelect;
export type MedicationClass = typeof medicationClass.$inferSelect;

export type MedicationWithClass = Medication & {
  class: MedicationClass;
};
