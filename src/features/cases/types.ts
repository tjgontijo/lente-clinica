import type {
  medication,
  patientCase,
  patientMedication,
} from "@/server/db/schema";

export type PatientCase = typeof patientCase.$inferSelect;
export type PatientMedication = typeof patientMedication.$inferSelect;

export type PatientCaseWithRelations = PatientCase & {
  medications: (PatientMedication & {
    medication: typeof medication.$inferSelect;
  })[];
};
