# DB Scripts

Organização dos scripts de banco e fluxos de dados da Lente Clínica.

## Fluxo de Inicialização e Enriquecimento (E2E)

Siga estas fases em ordem para reconstruir o banco e enriquecer os dados com a nova estrutura v5.0.

### Fase 1: Dados Básicos (Seed)
Popula as tabelas de classes, substâncias e produtos comerciais.
```bash
npm run db:seed
```

### Fase 2: Pipeline de Relevância
Determina quais substâncias são relevantes para a prática do terapeuta (Neuropsiquiátricas ou comportamentais). Apenas medicamentos marcados como relevantes (`shouldEnrichWithLlm = true`) seguem para a Fase 3.

1. **Gerar Batch**: `npx tsx src/server/db/scripts/relevance/generate-relevance-batch.ts`
2. **Enviar para OpenAI**: `npx tsx src/server/db/scripts/relevance/submit-relevance-batch.ts <arquivo_gerado>.jsonl`
3. **Consumir Resultados**: `npx tsx src/server/db/scripts/relevance/consume-relevance-batch.ts <batch_id>`

### Fase 3: Pipeline de Enriquecimento (v5.0)
Gera o conteúdo clínico detalhado focado em terapeutas (Domínios Clínicos, Discriminação de Sessão, etc).

1. **Gerar Batch**: `npm run enrich:medications:batch:generate`
2. **Enviar para OpenAI**: `npm run enrich:medications:batch:submit <arquivo_gerado>.jsonl`
3. **Consumir Resultados**: `npm run enrich:medications:batch:consume <batch_id>`

---

## Estrutura de Diretórios

- `maintenance/`: Utilitários de manutenção (reset, backup, restore, checks).
- `relevance/`: Scripts do pipeline de classificação de relevância clínica.
- `enrichment/`: Scripts do pipeline de enriquecimento de conteúdo via LLM.

## Utilitários Úteis
- **Reset de Banco**: `npm run db:reset` (Atenção: Apaga tudo e roda o seed)
- **Verificar Flags**: `npx tsx src/server/db/scripts/maintenance/check-medication-flags.ts`

