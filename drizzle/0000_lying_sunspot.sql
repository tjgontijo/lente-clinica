CREATE TYPE "public"."dosage_unit" AS ENUM('MG', 'MCG', 'G', 'ML', 'DROP', 'TABLET', 'CAPSULE');--> statement-breakpoint
CREATE TYPE "public"."enrichment_status" AS ENUM('PENDING', 'PENDING_BATCH', 'DONE', 'NEEDS_REVIEW', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."frequency_unit" AS ENUM('PER_DAY', 'PER_WEEK', 'EVERY_X_HOURS', 'AS_NEEDED');--> statement-breakpoint
CREATE TYPE "public"."intake_period" AS ENUM('MORNING', 'AFTERNOON', 'EVENING', 'BEDTIME', 'CUSTOM');--> statement-breakpoint
CREATE TYPE "public"."severity" AS ENUM('YELLOW', 'RED');--> statement-breakpoint
CREATE TABLE "account" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clinical_session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"case_id" uuid NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "communication_template" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scenario_id" text NOT NULL,
	"urgency_level" text DEFAULT 'YELLOW',
	"content_short" text NOT NULL,
	"content_medium" text,
	"content_formal" text,
	CONSTRAINT "communication_template_scenario_id_unique" UNIQUE("scenario_id")
);
--> statement-breakpoint
CREATE TABLE "medication" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"class_id" uuid NOT NULL,
	"name" text NOT NULL,
	"should_enrich_with_llm" boolean DEFAULT false NOT NULL,
	"description" text,
	"clinical_contexts" text[],
	"patient_reports" text[],
	"care_observations" text[],
	"clinical_confounders" text[],
	"useful_questions" text[],
	"coordination_notes" text[],
	"clinical_domains" jsonb,
	"session_discrimination_questions" text[],
	"communication_scenarios" text[],
	"attention_signals" jsonb,
	"clinical_phrase" text,
	"enrichment_status" "enrichment_status" DEFAULT 'PENDING' NOT NULL,
	"enriched_at" timestamp,
	"enrichment_model" text,
	"enrichment_prompt_version" text,
	"enrichment_batch_id" text,
	"enrichment_error" text,
	"enrichment_raw_response" jsonb,
	"mental_health_relevance" integer DEFAULT 0,
	"mental_health_relevance_reason" text,
	"mental_health_category" text,
	"is_visible" boolean DEFAULT true NOT NULL,
	CONSTRAINT "medication_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "medication_class" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"should_enrich_with_llm" boolean DEFAULT false NOT NULL,
	"mental_health_relevance" integer DEFAULT 0,
	CONSTRAINT "medication_class_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "medication_product" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"medication_id" uuid NOT NULL,
	"product_name" text NOT NULL,
	"product_type" text,
	"regulatory_label" text
);
--> statement-breakpoint
CREATE TABLE "medication_symptom_alert" (
	"medication_id" uuid NOT NULL,
	"symptom_id" uuid NOT NULL,
	"severity" "severity" NOT NULL,
	"context" text,
	CONSTRAINT "medication_symptom_alert_medication_id_symptom_id_pk" PRIMARY KEY("medication_id","symptom_id")
);
--> statement-breakpoint
CREATE TABLE "patient_case" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"first_name" text NOT NULL,
	"phone_suffix" text,
	"birth_year" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "patient_medication" (
	"case_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"is_current" boolean DEFAULT true NOT NULL,
	"dosage_amount" text,
	"dosage_unit" "dosage_unit",
	"frequency_value" integer,
	"frequency_unit" "frequency_unit",
	"intake_period" "intake_period",
	"intake_period_custom" text,
	CONSTRAINT "patient_medication_case_id_product_id_pk" PRIMARY KEY("case_id","product_id")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" uuid NOT NULL,
	"impersonated_by" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "session_observation" (
	"session_id" uuid NOT NULL,
	"symptom_id" uuid NOT NULL,
	CONSTRAINT "session_observation_session_id_symptom_id_pk" PRIMARY KEY("session_id","symptom_id")
);
--> statement-breakpoint
CREATE TABLE "symptom" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"name" text NOT NULL,
	"what_it_looks_like" text,
	"key_question" text,
	CONSTRAINT "symptom_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "symptom_category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "symptom_category_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"role" text,
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clinical_session" ADD CONSTRAINT "clinical_session_case_id_patient_case_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."patient_case"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medication" ADD CONSTRAINT "medication_class_id_medication_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."medication_class"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medication_product" ADD CONSTRAINT "medication_product_medication_id_medication_id_fk" FOREIGN KEY ("medication_id") REFERENCES "public"."medication"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medication_symptom_alert" ADD CONSTRAINT "medication_symptom_alert_medication_id_medication_id_fk" FOREIGN KEY ("medication_id") REFERENCES "public"."medication"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medication_symptom_alert" ADD CONSTRAINT "medication_symptom_alert_symptom_id_symptom_id_fk" FOREIGN KEY ("symptom_id") REFERENCES "public"."symptom"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patient_case" ADD CONSTRAINT "patient_case_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patient_medication" ADD CONSTRAINT "patient_medication_case_id_patient_case_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."patient_case"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patient_medication" ADD CONSTRAINT "patient_medication_product_id_medication_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."medication_product"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_observation" ADD CONSTRAINT "session_observation_session_id_clinical_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."clinical_session"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_observation" ADD CONSTRAINT "session_observation_symptom_id_symptom_id_fk" FOREIGN KEY ("symptom_id") REFERENCES "public"."symptom"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "symptom" ADD CONSTRAINT "symptom_category_id_symptom_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."symptom_category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "medication_product_medication_id_idx" ON "medication_product" USING btree ("medication_id");--> statement-breakpoint
CREATE INDEX "medication_product_name_idx" ON "medication_product" USING btree ("product_name");--> statement-breakpoint
CREATE UNIQUE INDEX "medication_product_unique_entry" ON "medication_product" USING btree ("medication_id","product_name","product_type","regulatory_label");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");