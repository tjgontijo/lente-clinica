import type {
  medication,
  medicationClass,
  medicationProduct,
} from "@/server/db/schema";

export type Medication = typeof medication.$inferSelect;
export type MedicationClass = typeof medicationClass.$inferSelect;
export type MedicationProduct = typeof medicationProduct.$inferSelect;

export type MedicationWithClass = Medication & {
  class: MedicationClass;
  products: MedicationProduct[];
};
