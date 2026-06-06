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
  id: uuid("id").defaultRandom().primaryKey(),
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
  cpfCnpj: text("cpf_cnpj"),
  phone: text("phone"),
});

export const session = pgTable(
  "session",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    impersonatedBy: text("impersonated_by"),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: uuid("user_id")
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
    id: uuid("id").defaultRandom().primaryKey(),
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
  mentalHealthRelevance: integer("mental_health_relevance").default(0),
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
  clinicalDomains: jsonb("clinical_domains"),
  sessionDiscriminationQuestions: text(
    "session_discrimination_questions",
  ).array(),
  communicationScenarios: text("communication_scenarios").array(),
  attentionSignals: jsonb("attention_signals"),
  attentionSignalsV4: text("attention_signals_v4").array(),
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
  mentalHealthRelevance: integer("mental_health_relevance").default(0),
  mentalHealthRelevanceReason: text("mental_health_relevance_reason"),
  mentalHealthCategory: text("mental_health_category"),
  isVisible: boolean("is_visible").default(true).notNull(),
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





// --- RELATIONS ---

export const userRelations = relations(user, ({ one, many }) => ({
  sessions: many(session),
  accounts: many(account),
  subscription: one(billingSubscription),
  invoices: many(billingInvoice),
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

// --- BILLING ---

export const billingSubscription = pgTable("billing_subscription", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  asaasCustomerId: text("asaas_customer_id"),
  asaasId: text("asaas_id").unique(),
  planCode: text("plan_code").notNull(),
  status: text("status").default("INACTIVE").notNull(),
  paymentMethod: text("payment_method"),
  isActive: boolean("is_active").default(false).notNull(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const billingInvoice = pgTable("billing_invoice", {
  id: uuid("id").primaryKey().defaultRandom(),
  subscriptionId: uuid("subscription_id")
    .notNull()
    .references(() => billingSubscription.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  asaasId: text("asaas_id").unique().notNull(),
  status: text("status").default("PENDING").notNull(),
  paymentMethod: text("payment_method").notNull(),
  value: text("value").notNull(),
  netValue: text("net_value"),
  description: text("description"),
  invoiceUrl: text("invoice_url"),
  dueDate: timestamp("due_date").notNull(),
  paidAt: timestamp("paid_at"),
  pixQrCodePayload: text("pix_qr_code_payload"),
  pixQrCodeImage: text("pix_qr_code_image"),
  pixExpirationDate: timestamp("pix_expiration_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const billingSubscriptionRelations = relations(
  billingSubscription,
  ({ one, many }) => ({
    user: one(user, {
      fields: [billingSubscription.userId],
      references: [user.id],
    }),
    invoices: many(billingInvoice),
  }),
);

export const billingInvoiceRelations = relations(billingInvoice, ({ one }) => ({
  subscription: one(billingSubscription, {
    fields: [billingInvoice.subscriptionId],
    references: [billingSubscription.id],
  }),
  user: one(user, {
    fields: [billingInvoice.userId],
    references: [user.id],
  }),
}));



