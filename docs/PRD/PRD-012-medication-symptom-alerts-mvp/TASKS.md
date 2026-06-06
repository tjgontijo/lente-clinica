# Tasks: Medication Symptom Alerts MVP

**Ultima atualizacao:** 2026-05-09

---

## 🔴 Fase 1: Criticos (1 a 1.5 dia)

### T1: Criar tabela de staging para candidatos

**Tempo estimado:** 2-3h

**Problema ou objetivo:** a IA nao deve popular diretamente `medication_symptom_alert`.

**Localizacao tecnica:**

- `src/server/db/schema.ts`
- migrations do Drizzle, caminho a confirmar no projeto

**O que fazer:**

- Criar `medicationSymptomAlertCandidate`.
- Usar UUID com `.defaultRandom()`, nao gerar ID no codigo.
- Relacionar com `medication` e `symptom`.
- Criar enum de status ou text com validacao no service.
- Salvar metadados de origem: prompt, modelo, resposta bruta.

**Snippet conceitual:**

```ts
export const medicationSymptomAlertCandidate = pgTable(
  "medication_symptom_alert_candidate",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    medicationId: uuid("medication_id").notNull().references(() => medication.id),
    symptomId: uuid("symptom_id").notNull().references(() => symptom.id),
    severity: severityEnum("severity").notNull(),
    context: text("context").notNull(),
    rationale: text("rationale"),
    sourcePromptVersion: text("source_prompt_version").notNull(),
    sourceModel: text("source_model").notNull(),
    rawResponse: jsonb("raw_response"),
    status: text("status").default("PENDING").notNull(),
    reviewedAt: timestamp("reviewed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
);
```

**Criterios de aceitacao:**

- Tabela criada.
- Relacoes adicionadas sem quebrar schema.
- Nenhum ID gerado no codigo.
- `npm run lint` passa.

**Como testar:**

- Rodar migration.
- Inserir candidato manual em ambiente local.

---

### T2: Criar gerador de batch IA para candidatos

**Tempo estimado:** 4-6h

**Problema ou objetivo:** popular candidatos usando apenas IA disponivel no MVP, com saida estruturada.

**Localizacao tecnica:**

- `src/server/db/scripts/alerts/generate-alert-candidates-batch.ts` novo
- `src/features/medications/prompts/medication-symptom-alert-candidates.prompt.ts` novo

**O que fazer:**

- Seguir padrao dos scripts `relevance` e `enrichment`.
- Selecionar medicamentos prioritarios, inicialmente `mentalHealthRelevance >= 8` ou `shouldEnrichWithLlm = true`.
- Passar ao prompt: medicamento, classe, campos enriquecidos e lista fechada de sintomas com `id`, `name`, `whatItLooksLike`, `category`.
- Exigir JSON schema estrito.
- Limitar candidatos por medicamento para reduzir ruido.

**Criterios de aceitacao:**

- Script gera `.jsonl` de batch.
- Cada request inclui apenas sintomas existentes.
- Prompt proibe causalidade conclusiva e conduta medicamentosa.
- Saida esperada contem `symptomId`, `severity`, `context`, `rationale`.

**Como testar:**

- Gerar batch para 1 a 3 medicamentos.
- Validar manualmente JSONL.

---

### T3: Criar consumidor de batch para staging

**Tempo estimado:** 3-5h

**Problema ou objetivo:** transformar respostas IA em candidatos auditaveis.

**Localizacao tecnica:**

- `src/server/db/scripts/alerts/consume-alert-candidates-batch.ts` novo
- schema Zod novo para validar resposta IA

**O que fazer:**

- Ler arquivo `.jsonl` de output.
- Validar custom id e corpo.
- Validar que `symptomId` existe.
- Ignorar duplicatas por `medicationId + symptomId + sourcePromptVersion`.
- Inserir em `medication_symptom_alert_candidate` com `PENDING`.

**Criterios de aceitacao:**

- Respostas invalidas nao entram no banco.
- Erros sao reportados no console com resumo.
- Duplicatas nao quebram execucao.

**Como testar:**

- Consumir arquivo pequeno local.
- Conferir candidatos no banco.

---

## 🟡 Fase 2: Robustez (1 a 2 dias)

### T4: Criar promocao de candidatos aprovados

**Tempo estimado:** 2-3h

**Problema ou objetivo:** mover candidatos aprovados para a tabela final.

**Localizacao tecnica:**

- `src/server/db/scripts/alerts/approve-alert-candidates.ts` novo
- `src/server/db/scripts/alerts/promote-approved-alert-candidates.ts` novo

**O que fazer:**

- MVP pode aprovar via script por `candidateId`, por medicamento ou por lote.
- Promover apenas `APPROVED`.
- Inserir em `medication_symptom_alert`.
- Atualizar status para `SEEDED`.

**Criterios de aceitacao:**

- Nao promove `PENDING` nem `REJECTED`.
- Nao duplica par existente na tabela final.
- Mostra resumo de promovidos e ignorados.

---

### T5: Trocar runtime para consulta deterministica

**Tempo estimado:** 2-3h

**Problema ou objetivo:** parar de usar match textual em `attentionSignals`.

**Localizacao tecnica:**

- `src/features/sessions/services/calculate-real-time-alerts.service.ts`
- possivel novo repository em `src/features/sessions/repositories/calculate-alerts.repository.ts`

**O que fazer:**

- Buscar medicaçoes ativas do caso.
- Cruzar medicamentos ativos com `medication_symptom_alert`.
- Filtrar por `symptomIds` selecionados.
- Retornar formato compativel com a UI atual.
- Manter autenticacao e ownership via service.

**Criterios de aceitacao:**

- Nenhuma IA chamada no runtime.
- Nenhum match textual por `includes`.
- Alertas aparecem apenas quando par estruturado existe.
- UI atual continua funcionando.

**Como testar:**

- Criar um par final manual.
- Marcar sintoma correspondente na tela.
- Confirmar alerta.
- Marcar sintoma sem par e confirmar ausencia de alerta.

---

### T6: Expandir schema de observacao da sessao

**Tempo estimado:** 3-5h

**Problema ou objetivo:** registrar contexto minimo para apoio medicamentoso.

**Localizacao tecnica:**

- `src/server/db/schema.ts`
- `src/features/sessions/schemas/sessions.schema.ts`
- `src/features/sessions/repositories/create-session.repository.ts`
- `src/features/sessions/services/create-session.service.ts`

**O que fazer:**

- Substituir `symptomIds` puro por `observations`.
- Manter compatibilidade temporaria se necessario.
- Cada observacao deve aceitar `symptomId`, `intensity`, `course`, `medicationTiming`, `note`.

**Criterios de aceitacao:**

- Criacao de sessao persiste observacoes enriquecidas.
- Schema valida enums.
- Repository nao acessa dados fora de sua camada.

---

### T7: Criar relatorio de cobertura

**Tempo estimado:** 1-2h

**Problema ou objetivo:** saber se a base esta utilizavel.

**Localizacao tecnica:**

- `src/server/db/scripts/alerts/check-alert-candidate-stats.ts` novo

**O que fazer:**

- Contar candidatos por status.
- Contar alertas finais por medicamento.
- Listar medicamentos prioritarios sem alerta final.
- Listar sintomas mais frequentes.

**Criterios de aceitacao:**

- Script roda localmente.
- Saida ajuda a decidir proximo lote.

---

## 🟢 Fase 3: Melhorias (0.5 dia)

### T8: Reorganizar tela em fluxo de observacao medicamentosa

**Tempo estimado:** 4-8h

**Problema ou objetivo:** a tela atual parece prontuario/checklist generico.

**Localizacao tecnica:**

- `src/app/(dashboard)/cases/[id]/sessions/new/page.tsx`
- `src/features/sessions/forms/session-checklist-form.tsx`
- componentes novos em `src/features/sessions/components`

**O que fazer:**

- Renomear para "Nova observacao medicamentosa".
- Mostrar medicaçoes atuais no topo.
- Dividir visualmente em etapas: medicaçoes atuais, sinais observados, pontos de atencao, revisao.
- Coletar temporalidade apenas para sintomas com alerta ou sintomas selecionados.

**Criterios de aceitacao:**

- A tela nao usa termos de prontuario.
- A usuaria entende por que o alerta apareceu.
- Nao ha perda de conteudo digitado.

---

### T9: Ajustar microcopy de seguranca clinica

**Tempo estimado:** 30min

**Problema ou objetivo:** reduzir interpretacao de causalidade.

**Localizacao tecnica:**

- `src/features/sessions/components/top-alerts-banner.tsx`
- `src/features/sessions/components/sticky-alerts-panel.tsx`
- novos componentes de pontos de atencao

**O que fazer:**

- Evitar "efeito colateral de" como afirmacao direta.
- Usar "pode merecer atencao em contexto de".
- Usar "relacao incerta" quando temporalidade nao for clara.

**Criterios de aceitacao:**

- Textos nao afirmam causalidade.
- Textos nao sugerem conduta medicamentosa.
- Tom segue design system da Lente Clinica.

---

## Comandos de Qualidade

```bash
npm run lint
```

Quando houver migrations e scripts:

```bash
npm run db:generate
npm run db:migrate
```

Os nomes exatos de scripts de banco devem ser confirmados no `package.json`.
