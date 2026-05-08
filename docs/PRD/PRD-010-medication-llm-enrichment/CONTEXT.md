# Contexto: Enriquecimento LLM de Medicamentos

## O Que E

O enriquecimento LLM e um processo batch para transformar o catalogo regulatorio de medicamentos em uma base clinica utilizavel por terapeutas. O objetivo e preencher fichas praticas por substancia, inspiradas no formato do Manual de Bolso da Psicofarmacologia.

O publico final e terapeuta que atende pacientes medicados. A linguagem deve apoiar observacao, perguntas clinicas e comunicacao com psiquiatra, sem sugerir prescricao.

## O Que Nao E

Nao e motor de decisao medica.

Nao e recomendador de medicamento.

Nao e interpretacao diagnostica automatica.

Nao deve gerar dose, ajuste, substituicao, suspensao ou orientacao de manejo farmacologico.

## Estado Atual do Dominio

### `medication_class`

Representa uma classe terapeutica importada do TSV.

Campos relevantes:

- `name`: codigo da classe, por exemplo `N6A4`
- `description`: descricao normalizada, por exemplo `Antidepressivos SSRI`
- `shouldEnrichWithLlm`: indica se medicamentos dessa classe entram no custo de LLM

### `medication`

Representa a substancia canonica.

Campos relevantes:

- `name`: nome da substancia
- `classId`: FK para `medication_class`
- `shouldEnrichWithLlm`: controle por medicamento para batch LLM
- `description`
- `commonUses`
- `patientReports`
- `sessionObservations`
- `confoundingEffects`
- `usefulQuestions`
- `clinicalPhrase`

### `medication_product`

Representa produto comercial associado a uma substancia.

Campos relevantes:

- `productName`
- `productType`
- `regulatoryLabel`
- `medicationId`

Essa tabela e fonte de nomes comerciais e contexto regulatorio. O enriquecimento principal deve continuar por substancia, nao por produto.

## Fonte de Dados

O catalogo vem de `docs/contexto/medicamentos.tsv`.

O seed atual:

- agrupa linhas por `SUBSTANCIA`
- salva uma linha por substancia em `medication`
- salva produtos comerciais em `medication_product`
- normaliza nomes para exibir melhor no banco
- converte `- (*)` em `null` para `regulatoryLabel`

## Fluxo Desejado

1. Script busca medicamentos com `shouldEnrichWithLlm = true`.
2. Script ignora medicamentos ja enriquecidos, salvo quando `--force` for usado.
3. Service monta prompt com:
   - nome da substancia
   - classe terapeutica
   - produtos comerciais principais
   - tarjas e tipos de produto como contexto secundario
4. LLM retorna JSON estruturado.
5. Zod valida o JSON.
6. Regras locais bloqueiam conteudo prescritivo.
7. Repository atualiza `medication`.
8. Script imprime resumo de sucesso, falha e itens pendentes.

## Estados Esperados

Adicionar ao `medication`:

- `enrichmentStatus`: `PENDING`, `DONE`, `NEEDS_REVIEW`, `FAILED`
- `enrichedAt`
- `enrichmentModel`
- `enrichmentPromptVersion`
- `enrichmentError`

Estado inicial:

- medicamentos com `shouldEnrichWithLlm = true` e campos clinicos vazios devem ser tratados como pendentes.

## Integracao LLM

Recomendacao: OpenAI SDK oficial.

Motivo:

- batch backend simples
- sem necessidade de streaming
- sem necessidade de UI hooks
- menor complexidade que Vercel AI SDK ou Mastra para este caso

## Validacoes Esperadas

Validar estrutura:

- arrays nao vazios nos campos principais
- textos curtos e objetivos
- `clinicalPhrase` com frase unica
- ausencia de campos extras

Validar seguranca:

- nao orientar dose
- nao orientar iniciar, trocar, reduzir ou suspender medicamento
- nao afirmar causalidade direta sem avaliacao medica
- nao substituir avaliacao psiquiatrica

## Permissoes

O script deve rodar em contexto backend/local, com acesso a `DATABASE_URL` e `OPENAI_API_KEY`.

Nao ha permissao de usuario final envolvida nesta fase, pois nao existe endpoint publico.

## Resumo Tecnico

Implementar um script idempotente em `src/server/db/scripts/enrich-medications.ts`, usando services e repositories dentro de `src/features/medications`. O script deve operar em lotes, validar respostas com Zod e persistir apenas resultados aprovados pelas validacoes locais.
