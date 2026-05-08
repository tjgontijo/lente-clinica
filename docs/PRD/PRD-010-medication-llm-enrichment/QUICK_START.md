# Quick Start: PRD-010 Enriquecimento LLM

## TL;DR

Implementar um script backend para enriquecer medicamentos marcados com `shouldEnrichWithLlm = true`, usando OpenAI SDK, validacao Zod e persistencia segura no banco. Conteudo gerado por LLM deve virar rascunho `NEEDS_REVIEW`, nunca `DONE` automaticamente.

Comece por metadados e schema de validacao. Depois implemente service, repositories e script batch.

## Tasks Resumidas

| Task | Prioridade | Local |
|------|------------|-------|
| T1 | Critica | `src/server/db/schema.ts` |
| T2 | Critica | `features/medications/schemas` |
| T3 | Critica | `features/medications/services` |
| T4 | Critica | `features/medications/services` |
| T5 | Critica | fluxo de revisao e estados |
| T6 | Moderada | `features/medications/repositories` |
| T7 | Critica | `src/server/db/scripts` |
| T8 | Menor | `package.json` |
| T9 | Baixa | `list-medications.repository.ts` |

## Comandos de Inicio

```bash
git checkout -b feature/prd-010-medication-llm-enrichment
npm install openai
npm run lint
```

Depois de alterar schema:

```bash
npm run db:push
```

Para testar o batch:

```bash
npm run enrich:medications -- --limit 1 --dry-run
npm run enrich:medications -- --only "Escitalopram"
```

## Arquivos Principais

- `src/server/db/schema.ts`
- `src/features/medications/schemas/medication-enrichment.schema.ts`
- `src/features/medications/prompts/medication-enrichment.prompt.ts`
- `src/features/medications/services/enrich-medication-with-llm.service.ts`
- `src/features/medications/services/validate-medication-enrichment.service.ts`
- `src/features/medications/repositories/list-medications-for-enrichment.repository.ts`
- `src/features/medications/repositories/update-medication-enrichment-draft.repository.ts`
- `src/features/medications/repositories/mark-medication-enrichment-needs-review.repository.ts`
- `src/features/medications/repositories/mark-medication-enrichment-failed.repository.ts`
- `src/server/db/scripts/enrich-medications.ts`

## Decisao de Schema

- manter `src/server/db/schema.ts` como schema centralizado.
- nao criar `src/server/db/schema/` neste PRD.
- modularizacao de schema fica para refactor separado, se necessario.

## Checklist de Validacao

- `OPENAI_API_KEY` ausente falha antes de chamar banco/LLM.
- prompt versionado existe como constante `MEDICATION_ENRICHMENT_PROMPT_VERSION`.
- saida da LLM segue contrato JSON validado por Zod.
- `--dry-run` nao grava dados.
- resposta invalida da LLM vira `FAILED` ou `NEEDS_REVIEW`.
- conteudo com prescricao ou dose nao e salvo como `DONE`.
- resposta valida da LLM fica como `NEEDS_REVIEW`, nao `DONE`.
- `clinicalContexts` substitui `commonUses` no schema, contrato JSON e persistencia.
- medicamento enriquecido nao e reprocessado sem `--force`.
- `description` e arrays clinicos aparecem preenchidos no banco.

## Sugestao de Commits

1. `feat(db): add medication enrichment metadata`
2. `feat(medications): add enrichment validation schemas`
3. `feat(medications): add llm enrichment service`
4. `feat(db): add medication enrichment batch script`
5. `feat(medications): search by commercial product name`
