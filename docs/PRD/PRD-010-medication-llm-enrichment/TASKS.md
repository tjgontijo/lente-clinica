# Tasks: PRD-010 Enriquecimento LLM de Medicamentos

**Status:** Planejado
**Total Tasks:** 8
**Estimativa total:** 6.25h

## T1: Adicionar metadados de enriquecimento no schema

**Tempo estimado:** 0.75h

**Objetivo:** permitir idempotencia, auditoria simples e retomada de batch.

**Localizacao tecnica:**

- `src/server/db/schema.ts`

**O que fazer:**

Adicionar enum e campos em `medication`:

```ts
export const enrichmentStatusEnum = pgEnum("enrichment_status", [
  "PENDING",
  "DONE",
  "NEEDS_REVIEW",
  "FAILED",
]);
```

Campos sugeridos:

- `enrichmentStatus`
- `enrichedAt`
- `enrichmentModel`
- `enrichmentPromptVersion`
- `enrichmentError`

**Criterios de aceitacao:**

- `db:push` cria os novos campos sem migration incremental.
- Medicamentos novos iniciam como `PENDING` ou sao tratados como pendentes quando campos clinicos estao vazios.
- O schema continua compilando.

**Como testar:**

- `npm run db:push`
- inspecionar tabela `medication`

## T2: Criar schema Zod da resposta LLM

**Tempo estimado:** 0.75h

**Objetivo:** garantir que a resposta tenha formato previsivel antes de persistir.

**Localizacao tecnica:**

- `src/features/medications/schemas/medication-enrichment.schema.ts`

**O que fazer:**

Criar schema com:

- `description: string`
- `commonUses: string[]`
- `patientReports: string[]`
- `sessionObservations: string[]`
- `confoundingEffects: string[]`
- `usefulQuestions: string[]`
- `clinicalPhrase: string`

Regras:

- arrays principais com minimo 3 itens
- strings com tamanho maximo razoavel
- `clinicalPhrase` com uma frase curta

**Criterios de aceitacao:**

- respostas incompletas falham.
- campos extras sao rejeitados ou ignorados de forma explicita.
- tipos exportados para service.

**Como testar:**

- teste manual com payload valido e invalido via `tsx` ou unit test se houver estrutura.

## T3: Criar regras locais de seguranca textual

**Tempo estimado:** 0.75h

**Objetivo:** bloquear conteudo prescritivo antes de salvar.

**Localizacao tecnica:**

- `src/features/medications/services/validate-medication-enrichment.service.ts`

**O que fazer:**

Criar checagem simples por termos e padroes proibidos, por exemplo:

- `aumentar dose`
- `reduzir dose`
- `suspender`
- `trocar por`
- `iniciar`
- `prescrever`
- `tomar X mg`

**Criterios de aceitacao:**

- retorno diferencia `valid`, `issues`.
- conteudo com orientacao de dose falha.
- conteudo observacional passa.

**Como testar:**

- validar exemplos sintéticos.

## T4: Implementar service de enriquecimento com OpenAI SDK

**Tempo estimado:** 1.5h

**Objetivo:** encapsular chamada LLM e prompt.

**Localizacao tecnica:**

- `src/features/medications/services/enrich-medication-with-llm.service.ts`

**Dependencia:**

- instalar `openai` se ainda nao existir.

**O que fazer:**

Service recebe:

- medicamento
- classe
- produtos principais
- prompt version

Service retorna:

- JSON validado pelo schema Zod
- modelo usado
- erro estruturado quando falhar

Prompt deve exigir:

- linguagem para terapeuta
- foco em observacao em sessao
- sem dose
- sem prescricao
- sem troca ou suspensao
- resposta em JSON estrito

**Criterios de aceitacao:**

- service nao acessa banco diretamente.
- service nao retorna texto livre.
- falhas de API sao capturadas.

**Como testar:**

- rodar 1 medicamento em modo manual com `OPENAI_API_KEY`.

## T5: Criar repositories de listagem e update

**Tempo estimado:** 0.75h

**Objetivo:** isolar acesso ao banco conforme arquitetura por features.

**Localizacao tecnica:**

- `src/features/medications/repositories/list-medications-for-enrichment.repository.ts`
- `src/features/medications/repositories/update-medication-enrichment.repository.ts`
- `src/features/medications/repositories/mark-medication-enrichment-failed.repository.ts`

**O que fazer:**

Listagem:

- filtrar `shouldEnrichWithLlm = true`
- incluir `class`
- incluir `products`
- permitir `limit`
- pular `DONE`, exceto com `force`

Update:

- atualizar campos clinicos
- atualizar status e metadados

**Criterios de aceitacao:**

- repositories nao chamam LLM.
- script nao escreve SQL inline.
- comportamento idempotente.

## T6: Criar script batch

**Tempo estimado:** 1.5h

**Objetivo:** executar enriquecimento por lote.

**Localizacao tecnica:**

- `src/server/db/scripts/enrich-medications.ts`
- `package.json`

**Comando sugerido:**

```bash
npm run enrich:medications -- --limit 10 --dry-run
```

Flags:

- `--limit`
- `--dry-run`
- `--force`
- `--only "Escitalopram"`

**Criterios de aceitacao:**

- script imprime progresso.
- dry-run nao grava no banco.
- falhas individuais nao interrompem todo o lote.
- resumo final mostra processados, sucesso, falha e pulados.

**Como testar:**

- `npm run enrich:medications -- --limit 1 --dry-run`
- `npm run enrich:medications -- --only "Escitalopram"`

## T7: Adicionar script no `package.json`

**Tempo estimado:** 0.25h

**Objetivo:** tornar execucao simples.

**Localizacao tecnica:**

- `package.json`

**O que fazer:**

Adicionar:

```json
"enrich:medications": "tsx src/server/db/scripts/enrich-medications.ts"
```

**Criterios de aceitacao:**

- comando roda sem caminho manual.
- script valida `OPENAI_API_KEY` antes de iniciar chamadas reais.

## T8: Ajustar busca por produto comercial

**Tempo estimado:** 0.75h

**Objetivo:** permitir que terapeuta encontre medicamento pelo nome comercial.

**Localizacao tecnica:**

- `src/features/medications/repositories/list-medications.repository.ts`

**O que fazer:**

Atualizar query para buscar tambem em `medication_product.productName`.

Alternativas:

- query SQL com join/subquery via Drizzle
- endpoint especifico de autocomplete por produto

**Criterios de aceitacao:**

- buscar `Lexapro` retorna `Escitalopram`.
- buscar substancia continua funcionando.
- query continua trazendo `class` e `products`.

**Observacao:**

Esta task pode ser feita depois do enriquecimento, mas e importante para o uso real do catalogo.
