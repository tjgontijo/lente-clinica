# Quick Start: PRD-011 Multiprofessional MVP

**TL;DR:** Transformação da base e interface de dados para abraçar profissionais além dos terapeutas. Trocando `sessionObservations` por `careObservations`, `confoundingEffects` por `clinicalConfounders`, e ampliando as instruções do prompt da LLM (v4.0). 5 problemas: 0 criticos, 2 moderados, 3 menores. Total: 2h.

---

## 📊 Resumo dos Problemas

| # | Problema | Severidade | Fix |
|---|----------|------------|-----|
| T1 | Banco com vies de terapeuta | 🟡 Moderado | Renomear campo em schema.ts e Zod |
| T2 | LLM instruida para terapeutas | 🟡 Moderado | Atualizar prompt estático para multiprofissional (v4.0) |
| T3 | Scripts de batch desatualizados | 🟢 Menor | Atualizar schema JSON estrito no gerador de arquivo .jsonl |
| T4 | UI com titulos restritivos | 🟢 Menor | Atualizar component `MedicationDetails` |
| T5 | Markdown quebrado | 🟢 Menor | Ajustar helper de copyToMarkdown |

---

## 🟡 Moderados (Primeiros Passos)

### T1 & T2: Database e Prompt

O mais importante é mudar a tipagem do schema do banco de dados e garantir que as novas medicações serão criadas no modo `careObservations`. Somente depois disso devemos executar novos lotes da Batch API.

**Como testar após implementar T1 e T2:**

```bash
npx drizzle-kit push
# Garantir que o banco aceite as novas colunas e as antigas sejam migradas ou dropadas se o DB for de teste.
```

---

## 📂 Arquivos Principais

- `src/server/db/schema.ts` - Schema do Drizzle.
- `src/features/medications/schemas/medication-enrichment.schema.ts` - Schema Zod.
- `src/features/medications/prompts/medication-enrichment.prompt.ts` - Prompt Estático da LLM.
- `src/features/medications/components/medication-details.tsx` - Interface de UI.

---

## 🚀 Comecar

```bash
git checkout -b feature/multiprofessional-mvp

# Passo 1: Atualize Zod e Schema (T1)
# Passo 2: Rode o push pro banco
npm run db:push # ou comando similar mapeado

# Passo 3: Atualize o prompt (T2) e script (T3)
# Passo 4: Atualize a UI (T4, T5)
```
