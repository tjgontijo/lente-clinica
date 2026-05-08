# Tasks: PRD-010 Enriquecimento LLM de Medicamentos

**Status:** Planejado
**Total Tasks:** 9
**Estimativa total:** 7h

## T1: Adicionar metadados de enriquecimento no schema

**Tempo estimado:** 0.75h

**Objetivo:** permitir idempotencia, auditoria simples e retomada de batch.

**Localizacao tecnica:**

- `src/server/db/schema.ts`

**Decisao arquitetural:**

- manter schema centralizado em `src/server/db/schema.ts`.
- nao modularizar schema neste PRD.
- se a modularizacao for desejada, abrir PRD/refactor separado.

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

- migration ou `db:push` executa sem erros conforme padrao atual do projeto.
- enum e campos sao criados corretamente.
- dados existentes recebem status inicial seguro ou sao tratados como pendentes por regra de query.
- Medicamentos novos iniciam como `PENDING` ou sao tratados como pendentes quando campos clinicos estao vazios.
- Nenhum novo arquivo de schema modular e criado neste PRD.
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
- `clinicalContexts: string[]`
- `patientReports: string[]`
- `sessionObservations: string[]`
- `confoundingEffects: string[]`
- `usefulQuestions: string[]`
- `clinicalPhrase: string`

Regras:

- arrays principais com minimo 3 itens
- arrays principais com maximo 8 itens
- strings com tamanho maximo razoavel
- `clinicalPhrase` com uma frase curta
- objeto sem campos extras

Contrato sugerido:

```ts
import { z } from "zod";

export const medicationEnrichmentSchema = z
  .object({
    description: z.string().min(80).max(700),
    clinicalContexts: z.array(z.string().min(8).max(180)).min(3).max(8),
    patientReports: z.array(z.string().min(8).max(180)).min(3).max(8),
    sessionObservations: z.array(z.string().min(12).max(240)).min(3).max(8),
    confoundingEffects: z.array(z.string().min(12).max(280)).min(3).max(8),
    usefulQuestions: z.array(z.string().min(8).max(220)).min(3).max(8),
    clinicalPhrase: z.string().min(20).max(180),
  })
  .strict();

export type MedicationEnrichmentOutput = z.infer<
  typeof medicationEnrichmentSchema
>;
```

Contrato JSON esperado:

```json
{
  "description": "Resumo curto do medicamento em linguagem observacional para terapeutas.",
  "clinicalContexts": ["Contexto clinico 1", "Contexto clinico 2", "Contexto clinico 3"],
  "patientReports": ["Relato 1", "Relato 2", "Relato 3"],
  "sessionObservations": ["Observacao 1", "Observacao 2", "Observacao 3"],
  "confoundingEffects": ["Confusao clinica 1", "Confusao clinica 2", "Confusao clinica 3"],
  "usefulQuestions": ["Pergunta 1", "Pergunta 2", "Pergunta 3"],
  "clinicalPhrase": "Frase clinica sintetica."
}
```

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
- validacao local e tratada como camada simples de bloqueio, nao como garantia clinica completa.
- conteudo aprovado por validacao local nao vira `DONE`, vira `NEEDS_REVIEW`.

**Como testar:**

- validar exemplos sintéticos.

## T4: Implementar service de enriquecimento com OpenAI SDK

**Tempo estimado:** 1.5h

**Objetivo:** encapsular chamada LLM e prompt.

**Localizacao tecnica:**

- `src/features/medications/services/enrich-medication-with-llm.service.ts`
- `src/features/medications/prompts/medication-enrichment.prompt.ts`

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

Prompt versionado:

```ts
export const MEDICATION_ENRICHMENT_PROMPT_VERSION =
  "medication-enrichment-v1";
```

Template minimo:

```txt
Voce esta gerando uma ficha clinica de apoio para terapeutas que atendem pacientes medicados.

Medicamento:
- Substancia: {{medicationName}}
- Classe terapeutica: {{classCode}} - {{classDescription}}
- Produtos comerciais conhecidos: {{productNames}}
- Tipos de produto: {{productTypes}}
- Tarjas conhecidas: {{regulatoryLabels}}

Objetivo:
Gerar conteudo observacional para ajudar a terapeuta a reconhecer possiveis efeitos na sessao, fazer perguntas melhores e alinhar observacoes com o medico quando necessario.

Limites obrigatorios:
- Nao prescrever.
- Nao sugerir dose.
- Nao sugerir iniciar, reduzir, aumentar, trocar ou suspender medicamento.
- Nao afirmar causalidade como certeza.
- Nao substituir avaliacao medica.
- Usar linguagem de observacao clinica.
- Escrever para terapeuta, nao para medico prescritor.

Responda apenas com JSON valido seguindo exatamente o contrato definido em medicationEnrichmentSchema.
```

Recomendacao de modelo:

- usar um modelo economico e confiavel para JSON estruturado
- armazenar o nome real em `enrichmentModel`
- nao hardcodar modelo em varios arquivos, usar constante no service

Estrategia de chamada:

- usar structured output ou JSON schema quando disponivel
- fazer parse seguro
- rejeitar markdown, campos extras e texto fora do contrato
- definir timeout
- definir retry limitado
- registrar erro bruto sanitizado
- nao salvar resposta parcial

**Criterios de aceitacao:**

- service nao acessa banco diretamente.
- service nao retorna texto livre.
- falhas de API sao capturadas.
- respostas validas tecnicamente sao retornadas para persistencia como rascunho, nao como conteudo final.

**Como testar:**

- rodar 1 medicamento em modo manual com `OPENAI_API_KEY`.

## T5: Definir fluxo de revisao e estados finais

**Tempo estimado:** 0.75h

**Objetivo:** evitar que conteudo gerado por LLM seja publicado como final sem revisao.

**Localizacao tecnica:**

- `src/server/db/schema.ts`
- `src/features/medications/repositories`
- `src/features/medications/services`

**O que fazer:**

- Conteudo gerado com sucesso deve ir para `NEEDS_REVIEW`.
- `DONE` deve representar conteudo revisado ou aprovado.
- `FAILED` deve representar erro tecnico, erro de validacao ou bloqueio de seguranca.
- Registrar `enrichedAt`, `enrichmentModel`, `enrichmentPromptVersion` e `enrichmentError` quando aplicavel.
- Garantir que frontend ou consultas publicas nao exibam conteudo `NEEDS_REVIEW` como se fosse final.

**Criterios de aceitacao:**

- Nenhum conteudo gerado por LLM vira `DONE` automaticamente.
- Conteudo valido estruturalmente vira `NEEDS_REVIEW`.
- Conteudo com risco textual vira `FAILED` ou `NEEDS_REVIEW` com issue registrada.
- `DONE` so pode ser definido por fluxo de revisao humana, curadoria posterior ou script explicito separado.

## T6: Criar repositories de listagem e update

**Tempo estimado:** 0.75h

**Objetivo:** isolar acesso ao banco conforme arquitetura por features.

**Localizacao tecnica:**

- `src/features/medications/repositories/list-medications-for-enrichment.repository.ts`
- `src/features/medications/repositories/update-medication-enrichment-draft.repository.ts`
- `src/features/medications/repositories/mark-medication-enrichment-needs-review.repository.ts`
- `src/features/medications/repositories/mark-medication-enrichment-done.repository.ts`
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
- salvar sucesso tecnico como `NEEDS_REVIEW`, nao `DONE`

**Criterios de aceitacao:**

- repositories nao chamam LLM.
- script nao escreve SQL inline.
- comportamento idempotente.
- existe repository explicito para `NEEDS_REVIEW`.

## T7: Criar script batch

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
- sucesso tecnico fica marcado como `NEEDS_REVIEW`.

**Como testar:**

- `npm run enrich:medications -- --limit 1 --dry-run`
- `npm run enrich:medications -- --only "Escitalopram"`

## T8: Adicionar script no `package.json`

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

## T9: Ajustar busca por produto comercial, opcional pos-pipeline

**Tempo estimado:** 0.75h

**Objetivo:** permitir que terapeuta encontre medicamento pelo nome comercial.

**Prioridade:** baixa para este PRD.

**Dependencia:** enriquecimento concluido ou em andamento. Pode virar PRD separado de busca/autocomplete.

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
