# Tasks: PRD-011 Multiprofissional MVP Implementation

**Data:** 2026-05-08 | **Status:** Draft | **Total Tasks:** 5 | **Estimado:** 2h

---

## 🔴 Fase 1: Robustez de Dados (30m)

### T1: Atualizar Database Schema e Zod Validation (30m)

**Problema:** Os dados estão tipados com viés de psicoterapia.

**Localizacao:** `src/server/db/schema.ts`, `src/features/medications/schemas/medication-enrichment.schema.ts`

**O que fazer:**

1. Em `schema.ts`, alterar a coluna:
   ```typescript
   careObservations: text("care_observations").array(),
   ```
2. Em `medication-enrichment.schema.ts`, remover `sessionObservations` e adicionar:
   ```typescript
   careObservations: z.array(z.string().max(240)).min(4).max(7),
   ```
3. Rodar a migração/push do banco se necessário (drizzle-kit push).

**Aceitacao:**
- [ ] Drizzle e Zod devem estar alinhados.
- [ ] TS Types não devem apresentar erros de compatibilidade com o Zod.

**Tempo:** 30m

---

## 🟡 Fase 2: Atualização de IA (45m)

### T2: Refatorar Prompt (v4.0) (30m)

**Problema:** O texto do prompt induz a IA a gerar relatórios terapêuticos restritos em vez de conteúdo multiprofissional.

**Localizacao:** `src/features/medications/prompts/medication-enrichment.prompt.ts`

**O que fazer:**

1. Alterar o texto inicial: "Público-alvo: Profissionais de saúde mental e cuidado clínico que acompanham o manejo da medicação (psicólogos, médicos generalistas, equipes)."
2. Modificar todas as ocorrências de "a terapeuta" para "o profissional".
3. Modificar "sessão" para "atendimento, consulta ou acompanhamento".
4. Substituir a regra e a estrutura JSON obrigatória para usar `careObservations`.
5. Atualizar a constante `MEDICATION_ENRICHMENT_PROMPT_VERSION` para `v4.0`.

**Aceitacao:**
- [ ] O JSON Schema descrito no prompt usa `careObservations`.
- [ ] Instruções focam em "profissionais" de forma genérica.

**Tempo:** 30m

### T3: Atualizar Batch Scripts (15m)

**Problema:** O script de envio para Batch API exige um Strict JSON Schema que ainda usa a chave antiga.

**Localizacao:** `src/server/db/scripts/generate-enrichment-batch.ts`

**O que fazer:**

1. Localizar o objeto `jsonSchema` na linha 50+.
2. Substituir a declaração de propriedades de `sessionObservations` para `careObservations`.
3. Ajustar `required` array.

**Aceitacao:**
- [ ] Script de geração executa sem erros do Typescript.

**Tempo:** 15m

---

## 🟢 Fase 3: Melhorias de Interface (45m)

### T4: Atualizar UI de Detalhes do Medicamento (30m)

**Problema:** O design e os títulos ainda focam apenas na sessão.

**Localizacao:** `src/features/medications/components/medication-details.tsx`

**O que fazer:**

1. Substituir "O que observar na sessão" por "O que observar no atendimento".
2. Alterar o mapeamento no JSX: `medication.careObservations?.map(...)`.
3. Trocar os ícones por opções mais adequadas ao "atendimento" se aplicável.

**Aceitacao:**
- [ ] Nenhum erro de Typescript nas chamadas da prop `medication`.
- [ ] Nova nomenclatura exibida na página.

**Tempo:** 30m

### T5: Ajustar Formatador de Markdown (15m)

**Problema:** O texto copiado estaria incompleto ou com título incorreto.

**Localizacao:** `src/features/medications/components/medication-details.tsx`

**O que fazer:**

1. Na função `copyToMarkdown`, alterar os geradores de markdown:
   ```typescript
   "\n## O que observar no atendimento",
   medication.careObservations?.map((o) => `- ${o}`).join("\n") || "N/A",
   ```

**Aceitacao:**
- [ ] Copy function não falha e gera os novos dados corretamente.

**Tempo:** 15m

---

## 📊 Resumo

| Task | Tempo | Bloqueador |
|------|-------|------------|
| T1 | 30m | Nenhum |
| T2 | 30m | T1 |
| T3 | 15m | T2 |
| T4 | 30m | T1 |
| T5 | 15m | T4 |

**Total:** 2h

---

**Status:** Validacao pendente
