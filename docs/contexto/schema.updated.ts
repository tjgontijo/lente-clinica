import { relations } from "drizzle-orm";
import {
  boolean,
  char,
  index,
  integer,
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
  (table) => [index("session_user_id_idx").on(table.userId)],
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
  (table) => [index("account_user_id_idx").on(table.userId)],
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

// --- MEDICATION CATALOG FROM TSV ---

export const medicationImportBatch = pgTable("medication_import_batch", {
  id: uuid("id").primaryKey().defaultRandom(),
  sourceFileName: text("source_file_name").notNull(),
  sourceFileHash: char("source_file_hash", { length: 64 }),
  totalRows: integer("total_rows"),
  importedRows: integer("imported_rows"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const medicationImportRow = pgTable(
  "medication_import_row",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    importBatchId: uuid("import_batch_id")
      .notNull()
      .references(() => medicationImportBatch.id, { onDelete: "cascade" }),
    rowNumber: integer("row_number").notNull(),

    substanceRaw: text("substance_raw").notNull(),
    productRaw: text("product_raw").notNull(),
    therapeuticClassRaw: text("therapeutic_class_raw").notNull(),
    productTypeRaw: text("product_type_raw").notNull(),
    regulatoryLabelRaw: text("regulatory_label_raw").notNull(),
    commercialDestinationRaw: text("commercial_destination_raw"),

    rowHash: char("row_hash", { length: 64 }),
    processed: boolean("processed").default(false).notNull(),
    processingError: text("processing_error"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("medication_import_row_batch_row_number_uq").on(
      table.importBatchId,
      table.rowNumber,
    ),
    index("medication_import_row_import_batch_id_idx").on(table.importBatchId),
    index("medication_import_row_row_hash_idx").on(table.rowHash),
  ],
);

export const therapeuticClass = pgTable(
  "therapeutic_class",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: text("code").notNull(),
    name: text("name").notNull(),
    normalizedName: text("normalized_name").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("therapeutic_class_code_uq").on(table.code),
    index("therapeutic_class_normalized_name_idx").on(table.normalizedName),
  ],
);

export const productType = pgTable(
  "product_type",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    normalizedName: text("normalized_name").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [uniqueIndex("product_type_normalized_name_uq").on(table.normalizedName)],
);

export const regulatoryLabel = pgTable(
  "regulatory_label",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    normalizedName: text("normalized_name").notNull(),
    isUnspecified: boolean("is_unspecified").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("regulatory_label_normalized_name_uq").on(table.normalizedName),
  ],
);

export const commercialDestination = pgTable(
  "commercial_destination",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    normalizedName: text("normalized_name").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("commercial_destination_normalized_name_uq").on(
      table.normalizedName,
    ),
  ],
);

export const substance = pgTable(
  "substance",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    normalizedName: text("normalized_name").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [uniqueIndex("substance_normalized_name_uq").on(table.normalizedName)],
);

export const medication = pgTable(
  "medication",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    therapeuticClassId: uuid("therapeutic_class_id")
      .notNull()
      .references(() => therapeuticClass.id),
    productTypeId: uuid("product_type_id")
      .notNull()
      .references(() => productType.id),
    regulatoryLabelId: uuid("regulatory_label_id")
      .notNull()
      .references(() => regulatoryLabel.id),
    commercialDestinationId: uuid("commercial_destination_id").references(
      () => commercialDestination.id,
    ),

    name: text("name").notNull(),
    normalizedName: text("normalized_name").notNull(),

    description: text("description"),
    commonUses: text("common_uses").array(),
    patientReports: text("patient_reports").array(),
    sessionObservations: text("session_observations").array(),
    confoundingEffects: text("confounding_effects").array(),
    usefulQuestions: text("useful_questions").array(),
    clinicalPhrase: text("clinical_phrase"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("medication_name_uq").on(table.name),
    index("medication_normalized_name_idx").on(table.normalizedName),
    index("medication_therapeutic_class_id_idx").on(table.therapeuticClassId),
    index("medication_product_type_id_idx").on(table.productTypeId),
    index("medication_regulatory_label_id_idx").on(table.regulatoryLabelId),
    index("medication_commercial_destination_id_idx").on(
      table.commercialDestinationId,
    ),
  ],
);

export const medicationSubstance = pgTable(
  "medication_substance",
  {
    medicationId: uuid("medication_id")
      .notNull()
      .references(() => medication.id, { onDelete: "cascade" }),
    substanceId: uuid("substance_id")
      .notNull()
      .references(() => substance.id),
    position: integer("position").default(1).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.medicationId, table.substanceId] }),
    index("medication_substance_substance_id_idx").on(table.substanceId),
  ],
);

// --- SYMPTOMS AND CLINICAL KNOWLEDGE ---

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

export const severityEnum = pgEnum("severity", ["YELLOW", "RED"]);

export const medicationSymptomAlert = pgTable(
  "medication_symptom_alert",
  {
    medicationId: uuid("medication_id")
      .notNull()
      .references(() => medication.id, { onDelete: "cascade" }),
    symptomId: uuid("symptom_id")
      .notNull()
      .references(() => symptom.id, { onDelete: "cascade" }),
    severity: severityEnum("severity").notNull(),
    context: text("context"),
  },
  (table) => [primaryKey({ columns: [table.medicationId, table.symptomId] })],
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
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const patientMedication = pgTable(
  "patient_medication",
  {
    caseId: uuid("case_id")
      .notNull()
      .references(() => patientCase.id, { onDelete: "cascade" }),
    medicationId: uuid("medication_id")
      .notNull()
      .references(() => medication.id),
    isCurrent: boolean("is_current").default(true).notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.caseId, table.medicationId] })],
);

export const clinicalSession = pgTable("clinical_session", {
  id: uuid("id").primaryKey().defaultRandom(),
  caseId: uuid("case_id")
    .notNull()
    .references(() => patientCase.id, { onDelete: "cascade" }),
  date: timestamp("date").defaultNow().notNull(),
  notes: text("notes"),
});

export const sessionObservation = pgTable(
  "session_observation",
  {
    sessionId: uuid("session_id")
      .notNull()
      .references(() => clinicalSession.id, { onDelete: "cascade" }),
    symptomId: uuid("symptom_id")
      .notNull()
      .references(() => symptom.id),
  },
  (table) => [primaryKey({ columns: [table.sessionId, table.symptomId] })],
);

// --- COMMUNICATION KIT ---

export const communicationTemplate = pgTable("communication_template", {
  id: uuid("id").primaryKey().defaultRandom(),
  scenarioId: text("scenario_id").unique().notNull(),
  urgencyLevel: severityEnum("urgency_level").default("YELLOW").notNull(),
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

export const medicationImportBatchRelations = relations(
  medicationImportBatch,
  ({ many }) => ({
    rows: many(medicationImportRow),
  }),
);

export const medicationImportRowRelations = relations(
  medicationImportRow,
  ({ one }) => ({
    importBatch: one(medicationImportBatch, {
      fields: [medicationImportRow.importBatchId],
      references: [medicationImportBatch.id],
    }),
  }),
);

export const therapeuticClassRelations = relations(
  therapeuticClass,
  ({ many }) => ({
    medications: many(medication),
  }),
);

export const productTypeRelations = relations(productType, ({ many }) => ({
  medications: many(medication),
}));

export const regulatoryLabelRelations = relations(
  regulatoryLabel,
  ({ many }) => ({
    medications: many(medication),
  }),
);

export const commercialDestinationRelations = relations(
  commercialDestination,
  ({ many }) => ({
    medications: many(medication),
  }),
);

export const substanceRelations = relations(substance, ({ many }) => ({
  medicationSubstances: many(medicationSubstance),
}));

export const medicationRelations = relations(medication, ({ one, many }) => ({
  therapeuticClass: one(therapeuticClass, {
    fields: [medication.therapeuticClassId],
    references: [therapeuticClass.id],
  }),
  productType: one(productType, {
    fields: [medication.productTypeId],
    references: [productType.id],
  }),
  regulatoryLabel: one(regulatoryLabel, {
    fields: [medication.regulatoryLabelId],
    references: [regulatoryLabel.id],
  }),
  commercialDestination: one(commercialDestination, {
    fields: [medication.commercialDestinationId],
    references: [commercialDestination.id],
  }),
  substances: many(medicationSubstance),
  symptomAlerts: many(medicationSymptomAlert),
  patientMedications: many(patientMedication),
}));

export const medicationSubstanceRelations = relations(
  medicationSubstance,
  ({ one }) => ({
    medication: one(medication, {
      fields: [medicationSubstance.medicationId],
      references: [medication.id],
    }),
    substance: one(substance, {
      fields: [medicationSubstance.substanceId],
      references: [substance.id],
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
