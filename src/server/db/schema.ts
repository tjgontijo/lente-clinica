import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

// --- AUTH (Better Auth - Generated via CLI pattern) ---

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  role: text("role"),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    impersonatedBy: text("impersonated_by"),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

// --- ENUMS ---

export const severityEnum = pgEnum("severity", ["YELLOW", "RED"]);
export const dosageUnitEnum = pgEnum("dosage_unit", [
  "MG",
  "MCG",
  "G",
  "ML",
  "DROP",
  "TABLET",
  "CAPSULE",
]);
export const frequencyUnitEnum = pgEnum("frequency_unit", [
  "PER_DAY",
  "PER_WEEK",
  "EVERY_X_HOURS",
  "AS_NEEDED",
]);
export const intakePeriodEnum = pgEnum("intake_period", [
  "MORNING",
  "AFTERNOON",
  "EVENING",
  "BEDTIME",
  "CUSTOM",
]);

export const enrichmentStatusEnum = pgEnum("enrichment_status", [
  "PENDING",
  "PENDING_BATCH",
  "DONE",
  "NEEDS_REVIEW",
  "FAILED",
]);

// --- KNOWLEDGE BASE ---

export const medicationClass = pgTable("medication_class", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  description: text("description"),
  shouldEnrichWithLlm: boolean("should_enrich_with_llm")
    .default(false)
    .notNull(),
});

export const medication = pgTable("medication", {
  id: uuid("id").primaryKey().defaultRandom(),
  classId: uuid("class_id")
    .notNull()
    .references(() => medicationClass.id),
  name: text("name").notNull().unique(),
  shouldEnrichWithLlm: boolean("should_enrich_with_llm")
    .default(false)
    .notNull(),
  description: text("description"),
  clinicalContexts: text("clinical_contexts").array(),
  patientReports: text("patient_reports").array(),
  careObservations: text("care_observations").array(),
  clinicalConfounders: text("clinical_confounders").array(),
  usefulQuestions: text("useful_questions").array(),
  coordinationNotes: text("coordination_notes").array(),
  attentionSignals: text("attention_signals").array(),
  clinicalPhrase: text("clinical_phrase"),
  enrichmentStatus: enrichmentStatusEnum("enrichment_status")
    .default("PENDING")
    .notNull(),
  enrichedAt: timestamp("enriched_at"),
  enrichmentModel: text("enrichment_model"),
  enrichmentPromptVersion: text("enrichment_prompt_version"),
  enrichmentBatchId: text("enrichment_batch_id"),
  enrichmentError: text("enrichment_error"),
  enrichmentRawResponse: jsonb("enrichment_raw_response"),
});

export const medicationProduct = pgTable(
  "medication_product",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    medicationId: uuid("medication_id")
      .notNull()
      .references(() => medication.id),
    productName: text("product_name").notNull(),
    productType: text("product_type"),
    regulatoryLabel: text("regulatory_label"),
  },
  (table) => [
    index("medication_product_medication_id_idx").on(table.medicationId),
    index("medication_product_name_idx").on(table.productName),
    uniqueIndex("medication_product_unique_entry").on(
      table.medicationId,
      table.productName,
      table.productType,
      table.regulatoryLabel,
    ),
  ],
);

export const symptomCategory = pgTable("symptom_category", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
});

export const symptom = pgTable("symptom", {
  id: uuid("id").primaryKey().defaultRandom(),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => symptomCategory.id),
  name: text("name").notNull().unique(),
  whatItLooksLike: text("what_it_looks_like"),
  keyQuestion: text("key_question"),
});

export const medicationSymptomAlert = pgTable(
  "medication_symptom_alert",
  {
    medicationId: uuid("medication_id")
      .notNull()
      .references(() => medication.id),
    symptomId: uuid("symptom_id")
      .notNull()
      .references(() => symptom.id),
    severity: severityEnum("severity").notNull(),
    context: text("context"),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.medicationId, t.symptomId] }),
  }),
);

// --- PATIENT DATA ---

export const patientCase = pgTable("patient_case", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  firstName: text("first_name").notNull(),
  phoneSuffix: text("phone_suffix"),
  birthYear: integer("birth_year"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const patientMedication = pgTable(
  "patient_medication",
  {
    caseId: uuid("case_id")
      .notNull()
      .references(() => patientCase.id),
    medicationId: uuid("medication_id")
      .notNull()
      .references(() => medication.id),
    isCurrent: boolean("is_current").default(true).notNull(),
    dosageAmount: text("dosage_amount"),
    dosageUnit: dosageUnitEnum("dosage_unit"),
    frequencyValue: integer("frequency_value"),
    frequencyUnit: frequencyUnitEnum("frequency_unit"),
    intakePeriod: intakePeriodEnum("intake_period"),
    intakePeriodCustom: text("intake_period_custom"),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.caseId, t.medicationId] }),
  }),
);

export const clinicalSession = pgTable("clinical_session", {
  id: uuid("id").primaryKey().defaultRandom(),
  caseId: uuid("case_id")
    .notNull()
    .references(() => patientCase.id),
  date: timestamp("date").defaultNow().notNull(),
  notes: text("notes"),
});

export const sessionObservation = pgTable(
  "session_observation",
  {
    sessionId: uuid("session_id")
      .notNull()
      .references(() => clinicalSession.id),
    symptomId: uuid("symptom_id")
      .notNull()
      .references(() => symptom.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.sessionId, t.symptomId] }),
  }),
);

// --- COMMUNICATION KIT ---

export const communicationTemplate = pgTable("communication_template", {
  id: uuid("id").primaryKey().defaultRandom(),
  scenarioId: text("scenario_id").unique().notNull(), // Ex: "inicio_antidepressivo_sem_melhora"
  urgencyLevel: text("urgency_level").default("YELLOW"), // YELLOW ou RED
  contentShort: text("content_short").notNull(),
  contentMedium: text("content_medium"),
  contentFormal: text("content_formal"),
});

// --- RELATIONS ---

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  patientCases: many(patientCase),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const medicationClassRelations = relations(
  medicationClass,
  ({ many }) => ({
    medications: many(medication),
  }),
);

export const medicationRelations = relations(medication, ({ one, many }) => ({
  class: one(medicationClass, {
    fields: [medication.classId],
    references: [medicationClass.id],
  }),
  products: many(medicationProduct),
  symptomAlerts: many(medicationSymptomAlert),
  patientMedications: many(patientMedication),
}));

export const medicationProductRelations = relations(
  medicationProduct,
  ({ one }) => ({
    medication: one(medication, {
      fields: [medicationProduct.medicationId],
      references: [medication.id],
    }),
  }),
);

export const symptomCategoryRelations = relations(
  symptomCategory,
  ({ many }) => ({
    symptoms: many(symptom),
  }),
);

export const symptomRelations = relations(symptom, ({ one, many }) => ({
  category: one(symptomCategory, {
    fields: [symptom.categoryId],
    references: [symptomCategory.id],
  }),
  medicationAlerts: many(medicationSymptomAlert),
  sessionObservations: many(sessionObservation),
}));

export const medicationSymptomAlertRelations = relations(
  medicationSymptomAlert,
  ({ one }) => ({
    medication: one(medication, {
      fields: [medicationSymptomAlert.medicationId],
      references: [medication.id],
    }),
    symptom: one(symptom, {
      fields: [medicationSymptomAlert.symptomId],
      references: [symptom.id],
    }),
  }),
);

export const patientCaseRelations = relations(patientCase, ({ one, many }) => ({
  user: one(user, {
    fields: [patientCase.userId],
    references: [user.id],
  }),
  medications: many(patientMedication),
  sessions: many(clinicalSession),
}));

export const patientMedicationRelations = relations(
  patientMedication,
  ({ one }) => ({
    case: one(patientCase, {
      fields: [patientMedication.caseId],
      references: [patientCase.id],
    }),
    medication: one(medication, {
      fields: [patientMedication.medicationId],
      references: [medication.id],
    }),
  }),
);

export const clinicalSessionRelations = relations(
  clinicalSession,
  ({ one, many }) => ({
    patientCase: one(patientCase, {
      fields: [clinicalSession.caseId],
      references: [patientCase.id],
    }),
    observations: many(sessionObservation),
  }),
);

export const sessionObservationRelations = relations(
  sessionObservation,
  ({ one }) => ({
    session: one(clinicalSession, {
      fields: [sessionObservation.sessionId],
      references: [clinicalSession.id],
    }),
    symptom: one(symptom, {
      fields: [sessionObservation.symptomId],
      references: [symptom.id],
    }),
  }),
);
