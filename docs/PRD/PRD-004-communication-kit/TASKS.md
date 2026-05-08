# Tasks: PRD-004 Communication Kit Backend

**Data:** 2026-05-08 | **Status:** Planejado | **Total Tasks:** 4 | **Estimado:** 3h

*(Nota: Foco exclusivamente em implementação de Backend/Services)*

---

## 🔴 Fase 1: Data Layer & Seed (1h)

### T1: Tabela de Templates
**Localização:** `src/server/db/schema.ts`
**O que fazer:**
Criar a tabela para suportar os formatos (Curto, Médio, Formal).
```typescript
export const communicationTemplates = pgTable("communication_templates", {
  id: uuid("id").defaultRandom().primaryKey(),
  scenarioId: text("scenario_id").unique().notNull(), // Ex: "inicio_antidepressivo_sem_melhora"
  urgencyLevel: text("urgency_level").default("YELLOW"), // YELLOW ou RED
  contentShort: text("content_short").notNull(),
  contentMedium: text("content_medium"),
  contentFormal: text("content_formal"),
});
```
Executar o `drizzle-kit push`.

### T2: Atualizar Script de Seed
**Localização:** `src/server/db/seed.ts`
**O que fazer:** Inserir os templates padrão extraídos do PDF, mantendo os placeholders exatos, ex: `Paciente [iniciais], em uso de [medicação]...`

---

## 🔴 Fase 2: O Motor Lógico (1.5h)

### T3: Implementar o Parser Service
**Problema:** Substituir os placeholders por dados reais.
**Localização:** `src/features/communication/services/generate-message.service.ts`

**O que fazer:**
1. Receber `sessionId` (e opcionalmente o formato desejado: `SHORT`, `MEDIUM`, `FORMAL`).
2. Fazer query na `clinicalSessions` para pegar o `caseId`.
3. Fazer query no `patientCases` para pegar `initials` e calcular `idade` a partir do `birthYear`.
4. Fazer query nas medicações ativas do paciente.
5. Fazer query nos sintomas observados para identificar a gravidade geral da sessão.
6. Fazer o *replace* das strings.

*Exemplo de snippet conceitual:*
```typescript
let text = template.contentShort;
text = text.replace("[iniciais]", patientCase.initials);
text = text.replace("[idade]", patientAge.toString());
text = text.replace("[medicação]", medicationsNames.join(", "));
// Retornar a string processada
```

**Aceitação:**
- [ ] Serviço roda isolado sem falhar se a idade ou outro dado opcional for nulo (usar fallbacks graciosos).

---

## 🟡 Fase 3: Exposição API (0.5h)

### T4: Server Action
**Localização:** `src/features/communication/actions.ts`
**O que fazer:**
Envolver o `generate-message.service.ts` em uma Server Action validada (zod) que verifica se a `session.user` tem permissão de acessar aquele `caseId`. Retornar a string.
