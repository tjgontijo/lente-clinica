import type { symptom, symptomCategory } from "@/server/db/schema";

export type Symptom = typeof symptom.$inferSelect;
export type SymptomCategory = typeof symptomCategory.$inferSelect;

export type SymptomWithCategory = Symptom & {
  category: SymptomCategory;
};
