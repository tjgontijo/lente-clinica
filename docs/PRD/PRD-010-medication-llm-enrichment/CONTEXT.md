# Contexto: Enriquecimento LLM de Medicamentos

## O Que E

O enriquecimento LLM e um processo batch para transformar o catalogo regulatorio de medicamentos em uma base clinica utilizavel por terapeutas. O objetivo e preencher fichas praticas por substancia, inspiradas no formato do Manual de Bolso da Psicofarmacologia.

O publico final e terapeuta que atende pacientes medicados. A linguagem deve apoiar observacao, perguntas clinicas e comunicacao com psiquiatra, sem sugerir prescricao.

Diretriz central:

```txt
O app nao orienta prescricao. O app orienta leitura clinica, observacao e comunicacao.
```

A funcionalidade nao deve sugerir inicio, troca, ajuste, suspensao, dose, combinacao ou escolha de medicacao.

O conteudo deve se limitar a:

- explicar, em linguagem clinica educativa, como determinada medicacao pode aparecer na sessao
- ajudar a terapeuta a observar mudancas de padrao
- sugerir perguntas investigativas nao prescritivas
- indicar quando organizar a observacao e comunicar ao psiquiatra
- reforcar que qualquer decisao medicamentosa pertence ao medico prescritor

## O Que Nao E

Nao e motor de decisao medica.

Nao e recomendador de medicamento.

Nao e interpretacao diagnostica automatica.

Nao deve gerar dose, ajuste, substituicao, suspensao ou orientacao de manejo farmacologico.

Nao autoriza publicacao automatica de conteudo clinico gerado por LLM sem revisao.

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
- `clinicalContexts`
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

## Decisao Arquitetural de Schema

O projeto atualmente usa schema centralizado em:

```txt
src/server/db/schema.ts
```

Para este PRD, manter o padrao atual e adicionar campos de enriquecimento no schema existente.

Nao modularizar o schema como parte desta entrega. Isso evita misturar o pipeline LLM com um refactor estrutural que pode afetar imports, relations, seed, Drizzle config e inferencias de tipos.

Se a modularizacao for priorizada depois, o formato sugerido e:

```txt
src/server/db/schema/
  auth.schema.ts
  medications.schema.ts
  cases.schema.ts
  sessions.schema.ts
  communications.schema.ts
  index.ts
```

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
7. Repository atualiza `medication` como rascunho clinico em `NEEDS_REVIEW`.
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

Transicoes obrigatorias:

```txt
PENDING
  gera com LLM

NEEDS_REVIEW
  passou no Zod e nas validacoes locais

DONE
  aprovado por revisao humana ou curadoria posterior

FAILED
  erro de API, erro de schema, parse invalido ou conteudo bloqueado
```

Regras de status:

- nenhum conteudo gerado por LLM vira `DONE` automaticamente
- conteudo valido estruturalmente vira `NEEDS_REVIEW`
- conteudo com risco textual vira `FAILED` ou `NEEDS_REVIEW` com issue registrada
- frontend ou consultas publicas nao devem exibir conteudo `NEEDS_REVIEW` como se fosse final

## Integracao LLM

Recomendacao: OpenAI SDK oficial.

Motivo:

- batch backend simples
- sem necessidade de streaming
- sem necessidade de UI hooks
- menor complexidade que Vercel AI SDK ou Mastra para este caso

## Contrato JSON Esperado

A resposta da LLM deve ser um unico objeto JSON, sem markdown, sem comentario e sem campos extras.

```json
{
  "description": "Resumo curto do medicamento em linguagem observacional para terapeutas.",
  "clinicalContexts": [
    "Contexto clinico em que a medicacao costuma aparecer",
    "Outro quadro ou situacao clinica associada ao uso observado",
    "Outro contexto relevante para leitura em sessao"
  ],
  "patientReports": [
    "Frase ou relato comum do paciente",
    "Outra fala possivel do paciente",
    "Outro relato clinicamente relevante"
  ],
  "sessionObservations": [
    "Sinal observavel em sessao",
    "Mudanca de corpo, afeto, sono, energia ou vinculo",
    "Padrao que pode afetar o processo terapeutico"
  ],
  "confoundingEffects": [
    "Efeito que pode parecer resistencia, depressao, ansiedade ou desorganizacao",
    "Risco de interpretar melhora como frieza ou sedacao como desmotivacao",
    "Outro ponto que confundiria a leitura clinica"
  ],
  "usefulQuestions": [
    "Pergunta observacional para entender temporalidade",
    "Pergunta sobre impacto funcional",
    "Pergunta sobre adesao, sono, corpo ou relacao"
  ],
  "clinicalPhrase": "Frase sintetica e memoravel, sem tom publicitario."
}
```

Campos proibidos:

- `dosage`
- `dose`
- `prescription`
- `recommendation`
- `medicalConduct`
- `ethicalCare`

Observacao sobre nomes de campos:

- `clinicalContexts` deve ser o nome persistido no banco e no contrato JSON
- na UI, preferir rotulo `Onde costuma aparecer na pratica clinica`
- evitar rotulos como `o que fazer`
- preferir `Como organizar a observacao`
- evitar `alertas de urgencia` quando o contexto for educativo
- preferir `Sinais que merecem atencao`

## Prompt Base Versionado

Versao inicial: `medication-enrichment-v1`.

O prompt deve ser mantido no codigo como constante versionada, por exemplo em:

```txt
src/features/medications/prompts/medication-enrichment.prompt.ts
```

Estrutura recomendada:

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
- Se a resposta exigir conduta medicamentosa, gerar apenas conteudo observacional e recomendar organizar a observacao para avaliacao do medico prescritor.

Responda apenas com JSON valido seguindo exatamente o contrato fornecido.
```

O service deve montar o prompt com dados do banco e passar o contrato JSON tambem como schema de resposta ou instrucao explicita, dependendo da API usada.

Estrategia de saida:

- usar recurso de structured output ou JSON schema quando disponivel
- fazer parse seguro
- validar com Zod
- rejeitar markdown, campos extras e texto fora do contrato
- definir timeout de chamada
- definir retry limitado
- registrar erro bruto sanitizado
- nao salvar resposta parcial

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
- nao salvar ou exibir instrucoes sobre dose, inicio, retirada, substituicao ou ajuste de medicacao

## Bloqueio de Producao

Este PRD permite gerar conteudo interno, mas nao autoriza publicacao direta ao usuario final sem revisao.

Conteudo gerado por LLM deve ser tratado como rascunho clinico ate passar por revisao humana, curadoria tecnica ou processo equivalente.

## Permissoes

O script deve rodar em contexto backend/local, com acesso a `DATABASE_URL` e `OPENAI_API_KEY`.

Nao ha permissao de usuario final envolvida nesta fase, pois nao existe endpoint publico.

## Resumo Tecnico

Implementar um script idempotente em `src/server/db/scripts/enrich-medications.ts`, usando services e repositories dentro de `src/features/medications`. O script deve operar em lotes, validar respostas com Zod e persistir resultados validos como `NEEDS_REVIEW`, nunca como `DONE` automaticamente.
