# Tasks: PRD-003 Clinical Sessions (Backend)

**Data:** 2026-05-08 | **Status:** Planejado | **Total Tasks:** 4 | **Estimado:** 3h

---

## 🔴 Fase 1: Data Layer & Motor (2h)

### T1: Drizzle Schema para Sessões
**Localização:** `src/server/db/schema.ts`
**O que fazer:**
```typescript
export const clinicalSessions = pgTable("clinical_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  caseId: uuid("case_id").notNull().references(() => patientCases.id, { onDelete: "cascade" }),
  date: timestamp("date").defaultNow().notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sessionObservations = pgTable("session_observations", {
  sessionId: uuid("session_id").notNull().references(() => clinicalSessions.id, { onDelete: "cascade" }),
  symptomId: uuid("symptom_id").notNull().references(() => symptoms.id),
}, (t) => ({
  pk: primaryKey({ columns: [t.sessionId, t.symptomId] }),
}));
```

### T2: Serviço de Alertas Cruzados (A Inteligência)
**Localização:** `src/features/sessions/services/get-active-alerts.service.ts`
**O que fazer:**
Receber o `caseId`. Buscar os `medicationId` ativos (`isCurrent: true`). Fazer JOIN com `medication_symptom_alerts`. Retornar agrupado por `severity`.

---

## 🟡 Fase 2: Robustez & Actions (1h)

### T3: Serviço de Criação de Sessão
**Localização:** `src/features/sessions/services/create-session.service.ts`
**O que fazer:**
Serviço que aceita `caseId`, `date`, `notes` e um array de `symptomIds`. Usar transação (`db.transaction`) para inserir a `ClinicalSession` e os registros na pivô `SessionObservation` atomicamente.

### T4: Server Actions
**Localização:** `src/features/sessions/actions.ts`
**O que fazer:** Expor os serviços como Server Actions autenticadas.
