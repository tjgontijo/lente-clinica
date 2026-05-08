# Diagnostico: Enriquecimento LLM de Medicamentos

## Resumo Executivo

O banco ja tem a base estrutural para enriquecimento, mas ainda nao existe pipeline operacional. O maior risco nao e custo de API, e sim gravar conteudo clinico inseguro ou inconsistente. A implementacao precisa priorizar saida estruturada, validacao, idempotencia e metadados de execucao.

## Problemas Criticos

### C1: Falta controle de status por medicamento

Sem `enrichmentStatus` e metadados, nao da para saber o que ja foi enriquecido, o que falhou e qual prompt/modelo foi usado.

Impacto:

- reprocessamento desnecessario
- custo duplicado
- baixa rastreabilidade
- dificuldade para retomar batch interrompido

### C2: Falta validacao de seguranca clinica

O schema atual aceita texto livre nos campos clinicos. Se uma resposta LLM trouxer linguagem prescritiva, ela pode ser salva sem bloqueio.

Impacto:

- risco de conteudo fora do papel da terapeuta
- risco de orientar conduta medica
- risco reputacional e clinico

## Problemas Moderados

### M1: Falta schema Zod para resposta LLM

Sem schema, o script teria que confiar na resposta do modelo.

Impacto:

- campos ausentes
- arrays vazios
- conteudo longo demais
- formato inconsistente

### M2: Falta prompt versionado

O prompt vai evoluir. Sem `enrichmentPromptVersion`, nao da para saber quais fichas foram geradas com cada criterio.

Impacto:

- reprocessamento sem criterio
- comparacao dificil entre geracoes

### M3: Falta dry-run

Antes de gravar 156 medicamentos, e melhor rodar uma amostra pequena e revisar saida.

Impacto:

- maior chance de gastar tokens com prompt ainda imaturo
- retrabalho manual

### M4: Busca atual nao pesquisa produto comercial

O repository de listagem busca por `medication.name`. Depois que `medication_product` virou fonte oficial de produto, a busca por nome comercial pode precisar ser expandida em tarefa separada ou no mesmo pacote.

Impacto:

- terapeuta pode buscar por marca e nao encontrar
- UX abaixo do esperado

## Problemas Menores

### m1: Falta relatorio final do batch

O script precisa imprimir total processado, sucesso, falha, custo aproximado quando disponivel e itens pendentes.

Impacto:

- menor visibilidade operacional

### m2: Falta limite configuravel de lote

Sem `--limit`, `--only`, `--force` e `--dry-run`, o script fica pouco ergonomico.

Impacto:

- testes mais lentos
- maior risco de execucao ampla sem querer

## O Que Esta Bem

- `medication.shouldEnrichWithLlm` ja separa candidatos de LLM.
- O numero estimado, cerca de 156 substancias, e pequeno.
- O dominio ja esta separado em `features/medications`.
- `zod` ja existe no projeto.
- O seed ja diferencia substancia de produto comercial.
- Os campos clinicos principais ja existem no schema.

## Matriz de Risco

| Problema | Severidade | Probabilidade | Risco | Esforco |
|----------|------------|---------------|-------|---------|
| Falta controle de status | Alto | Alta | CRITICO | Baixo |
| Conteudo prescritivo | Alto | Media | CRITICO | Medio |
| Saida fora do schema | Medio | Media | MEDIO | Baixo |
| Prompt sem versionamento | Medio | Media | MEDIO | Baixo |
| Sem dry-run | Medio | Media | MEDIO | Baixo |
| Busca sem produto comercial | Medio | Media | MEDIO | Medio |
| Relatorio fraco do batch | Baixo | Media | BAIXO | Baixo |

## Ordem de Fixacao

1. Adicionar metadados de enriquecimento no schema.
2. Criar schema Zod de saida.
3. Criar prompt e service OpenAI.
4. Criar repositories de listagem e update.
5. Criar script batch com dry-run e limit.
6. Rodar amostra manual e revisar.
7. Rodar lote completo.
8. Ajustar busca por produto comercial, se entrar no escopo da implementacao.

## Proximos Passos

Implementar as tasks de `TASKS.md` na ordem. Nao iniciar pelo script antes de definir o schema de metadados e a validacao da resposta.
