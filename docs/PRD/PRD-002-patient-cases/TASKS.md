# Tasks: PRD-002 Gestão de Casos (Backend)

**Data:** 2026-05-08 | **Status:** Planejado | **Total Tasks:** 4 | **Estimado:** 2h

---

## 🔴 Fase 1: Data Layer (1h)

### T1: Criar Schema Drizzle para Cases
**Localização:** `src/server/db/schema.ts`

**O que fazer:**
Criar `patientCases` e `patientMedications`.
```typescript
export const patientCases = pgTable("patient_cases", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  initials: text("initials").notNull(),
  birthYear: integer("birth_year"),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const patientMedications = pgTable("patient_medications", {
  caseId: uuid("case_id").notNull().references(() => patientCases.id, { onDelete: "cascade" }),
  medicationId: uuid("medication_id").notNull().references(() => medications.id),
  isCurrent: boolean("is_current").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.caseId, t.medicationId] }),
}));
```

### T2: Criar Zod Schemas
**Localização:** `src/features/cases/schemas/cases.schema.ts`
**O que fazer:** Criar esquemas de validação de criação e vinculação (Iniciais obrigatoriamente uppercase e <= 5 caracteres).

---

## 🟡 Fase 2: Services e Actions (1h)

### T3: Implementar Services
**Localização:** `src/features/cases/services/`
**O que fazer:**
1. `create-case.service.ts`
2. `list-cases.service.ts`
3. `link-medication.service.ts`

### T4: Server Actions
**Localização:** `src/features/cases/actions.ts`
**O que fazer:** Expor os services como Server Actions, verificando `auth()`.
