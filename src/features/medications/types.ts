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

export type ProductWithMedication = MedicationProduct & {
  medication: Medication & {
    class: MedicationClass;
  };
};

export type ListMedicationsInput = {
  search?: string;
  offset?: number;
  limit?: number;
};

export type ListMedicationsResult = {
  items: ProductWithMedication[];
  nextOffset: number | null;
};
