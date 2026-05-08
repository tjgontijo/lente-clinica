# Diagnostic: Transição Multiprofissional do Enriquecimento

**Data:** 2026-05-08
**Status:** Validacao Pendente
**Escopo:** Database Schema, LLM Prompts, Validation Schemas, UI Components

---

## 📋 Resumo Executivo

O pipeline de enriquecimento construído no PRD-010 funciona perfeitamente, porém o conteúdo gerado e o schema de banco de dados são fortemente tipados para "psicoterapia" (ex: `sessionObservations`, "terapeutas"). Isso representa um bloqueador comercial para a estratégia de SaaS multiprofissional do MVP. 

Identificamos a necessidade de refatorar as nomenclaturas e a engenharia de prompt antes de executar o lote final de 151 medicamentos.

- 🔴 0 Criticos
- 🟡 2 Moderados, bloqueiam a geração em massa com a linguagem correta.
- 🟢 3 Menores, afetam a exibição e integração de scripts.

**Conclusao:** É necessário realizar um ajuste estrutural focado em nomenclatura e prompt engineering para alinhar o código ao novo posicionamento B2C/B2B.

---

## 🟡 Problemas Moderados

### 1. Nomenclatura Restritiva no Banco de Dados

**Problema:** O schema do banco e o Zod usam `sessionObservations`. Se povoarmos a base de dados com 152 medicamentos agora, teremos débito técnico difícil de migrar depois quando o termo "sessão" se provar limitante para médicos e enfermeiros.

**Localizacao:** `src/server/db/schema.ts`, `src/features/medications/schemas/medication-enrichment.schema.ts`

**Impacto:**
- ⚠️ Dificulta o mapeamento genérico em APIs futuras.
- ⚠️ Exige conversão manual no front-end para perfis não terapeutas.

**Solucao Necessaria:**
1. Renomear o campo para `careObservations` no Zod.
2. Renomear a coluna e o atributo no Drizzle Schema.
3. Atualizar o tipo `MedicationEnrichmentData`.

### 2. Viés Psicoterapêutico no Prompt da OpenAI

**Problema:** A LLM está instruída para ajudar "terapeutas" a observar o paciente na "sessão". Isso contamina as respostas (ex: `clinicalPhrase`, `usefulQuestions`) com foco excessivo no vínculo psicoterápico em detrimento da triagem e acompanhamento médico geral.

**Localizacao:** `src/features/medications/prompts/medication-enrichment.prompt.ts`

**Impacto:**
- ⚠️ A qualidade clínica cai para médicos de família e enfermeiros, enfraquecendo a promessa do MVP.

**Solucao Necessaria:**
1. Reescrever `MEDICATION_ENRICHMENT_STATIC_PROMPT` para focar em "profissionais de saúde mental e cuidado clínico".
2. Substituir o json schema obrigatório dentro do prompt.
3. Atualizar a versão do prompt para `v4.0`.

---

## 🟢 Problemas Menores

### 3. Falha nos Scripts de Batch

**Problema:** Os scripts geram o arquivo JSONL usando os tipos inferidos e esquemas antigos.

**Localizacao:** `src/server/db/scripts/generate-enrichment-batch.ts`

**Impacto:**
- 🟢 O batch envia o JSON Schema incorreto (com `sessionObservations`).

**Solucao Necessaria:**
1. Atualizar a constante de schema JSON em `generate-enrichment-batch.ts`.

### 4. UI Incompatível com o Novo Schema

**Problema:** `MedicationDetails` espera `medication.sessionObservations` e possui títulos com viés (ex: "O que observar na sessão").

**Localizacao:** `src/features/medications/components/medication-details.tsx`

**Impacto:**
- 🟢 Exibe dados nulos caso os novos campos não sejam mapeados.

**Solucao Necessaria:**
1. Alterar a propriedade lida no componente para `careObservations`.
2. Mudar o título da sessão de "O que observar na sessão" para "O que observar no atendimento".

### 5. Formatador de Markdown Quebrado

**Problema:** O método `copyToMarkdown` lê propriedades antigas e injeta subtítulos antigos.

**Localizacao:** `src/features/medications/components/medication-details.tsx`

**Impacto:**
- 🟢 O copy/paste gera documentos incongruentes para os usuários finais.

**Solucao Necessaria:**
1. Mapear o formatador para refletir a nova estrutura ampla.

---

## 📊 Matriz de Risco

| Problema | Severidade | Probabilidade | Risco | Esforco |
|----------|------------|---------------|-------|---------|
| Banco e Zod (T1) | Medio | Alta | MEDIO | 30m |
| Prompt Eng (T2) | Medio | Alta | MEDIO | 30m |
| Batch Scripts (T3)| Baixo | Alta | BAIXO | 15m |
| UI Update (T4) | Baixo | Alta | BAIXO | 30m |
| MD Format (T5) | Baixo | Alta | BAIXO | 15m |

---

## 🎯 Ordem de Fixacao

### Fase 1: Robustez de Dados (30m)
1. T1: Renomear sessionObservations para careObservations (Drizzle/Zod).

### Fase 2: Atualização de IA (45m)
2. T2: Reescrever o Prompt de Enriquecimento (v4.0).
3. T3: Atualizar o JSON Schema do gerador de batch.

### Fase 3: Melhorias e Integração (45m)
4. T4: Atualizar UI de detalhes do medicamento.
5. T5: Ajustar o exportador de Markdown.

**Total Estimado:** 2h

---

**Status:** Validacao pendente
