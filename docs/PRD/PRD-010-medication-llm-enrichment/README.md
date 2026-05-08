# PRD-010: Enriquecimento LLM de Medicamentos

**Status:** Planejado
**Data:** 2026-05-08
**Versao:** 1.0

## O Que Este PRD Cobre

Este PRD define a implementacao de um pipeline backend para enriquecer medicamentos com informacoes clinicas orientadas a terapeutas. O enriquecimento deve preencher os campos clinicos da tabela `medication` usando LLM, com saida estruturada, validacao por Zod e persistencia idempotente.

O pipeline nao roda no frontend. Ele deve ser executado como script batch, controlado por flag no banco e preparado para reprocessamento seguro.

## Escopo

Inclui:

- selecao de medicamentos com `medication.shouldEnrichWithLlm = true`
- chamada de LLM via OpenAI SDK oficial
- schema Zod para validar a resposta
- persistencia de `description`, `commonUses`, `patientReports`, `sessionObservations`, `confoundingEffects`, `usefulQuestions` e `clinicalPhrase`
- metadados de enriquecimento para auditoria simples
- criterios de seguranca para evitar linguagem prescritiva

Nao inclui:

- interface editorial de revisao humana
- streaming ou chamada pelo navegador
- enriquecimento por produto comercial
- decisao clinica, dose, prescricao, troca ou suspensao de medicamento

## Status Atual

O catalogo base ja existe:

- `medication` representa a substancia canonica
- `medication_product` representa nomes comerciais e dados regulatorios do TSV
- `medication_class.shouldEnrichWithLlm` define classes candidatas
- `medication.shouldEnrichWithLlm` define medicamentos candidatos
- o seed importa `docs/contexto/medicamentos.tsv`

Falta implementar o pipeline de enriquecimento.

## Entregas

| Fase | Entrega | Estimativa |
|------|---------|------------|
| 1 | Schema de metadados e status | 0.75h |
| 2 | Schema Zod de saida LLM | 0.75h |
| 3 | Service OpenAI e prompt | 1.5h |
| 4 | Repository de update | 0.75h |
| 5 | Script batch | 1.5h |
| 6 | Validacoes e dry-run | 1h |

**Total estimado:** 6.25h

## Arquivos Principais

- `src/server/db/schema.ts`
- `src/features/medications/schemas/medication-enrichment.schema.ts`
- `src/features/medications/services/enrich-medication-with-llm.service.ts`
- `src/features/medications/repositories/list-medications-for-enrichment.repository.ts`
- `src/features/medications/repositories/update-medication-enrichment.repository.ts`
- `src/server/db/scripts/enrich-medications.ts`
- `package.json`

## Risco Resumido

| Problema | Severidade | Probabilidade | Risco | Esforco |
|----------|------------|---------------|-------|---------|
| Conteudo prescritivo ou inseguro | Alto | Media | CRITICO | Medio |
| Reprocessamento caro ou duplicado | Medio | Media | MEDIO | Baixo |
| Saida LLM fora do formato | Medio | Media | MEDIO | Baixo |
| Falta de observabilidade do batch | Medio | Media | MEDIO | Baixo |
| Prompt sem padrao editorial | Medio | Media | MEDIO | Medio |

## Como Comecar

Leia primeiro:

1. `CONTEXT.md`
2. `DIAGNOSTIC.md`
3. `TASKS.md`
4. `QUICK_START.md`

Depois implemente a partir da T1, pois o script depende dos metadados e schemas.
