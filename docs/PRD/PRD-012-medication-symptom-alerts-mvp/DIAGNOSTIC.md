# Diagnostic: Medication Symptom Alerts MVP

**Ultima atualizacao:** 2026-05-09

---

## Resumo Executivo

O sistema tem a estrutura inicial para alertas medicamentosos por sintoma, mas ainda nao tem pipeline confiavel para popular `medication_symptom_alert`. A tela de nova sessao usa um metodo fragil, baseado em texto livre de `attentionSignals`, o que prejudica previsibilidade, auditabilidade e qualidade da experiencia.

O MVP pode usar IA, mas deve usar IA apenas para gerar candidatos em batch. O runtime precisa ser deterministico.

---

## 🔴 Problemas Criticos

### P1: Tabela final existe, mas nao ha fluxo de populacao

`medication_symptom_alert` esta definida em `src/server/db/schema.ts`, com relacoes para `medication` e `symptom`, mas nao ha scripts encontrados para popular ou manter essa tabela.

**Impacto:**

- O modelo certo existe, mas nao sustenta a UX.
- O produto fica dependente de campos textuais enriquecidos.

**Risco:** CRITICO.

### P2: Runtime usa match textual fragil

`calculateRealTimeAlertsService` percorre `med.attentionSignals` e usa `includes` com o nome do sintoma.

**Impacto:**

- Pode nao encontrar sinonimos.
- Pode gerar falso positivo por substring.
- Nao e auditavel por par estruturado.
- A severidade e inferida por regex de palavras criticas.

**Risco:** CRITICO.

### P3: Inserir IA direto na tabela final seria arriscado

Como o usuario so pode contar com IA no MVP, ha tentacao de gerar diretamente os registros finais.

**Impacto:**

- Erros da IA viram comportamento de produto.
- Dificulta revisao e rollback.
- Dificulta explicar origem do alerta.

**Risco:** CRITICO.

---

## 🟡 Problemas Moderados

### P4: Sessao salva apenas presenca do sintoma

`session_observation` salva somente `sessionId` e `symptomId`.

**Impacto:**

- Nao registra intensidade.
- Nao registra temporalidade.
- Nao diferencia sintoma preexistente de sintoma apos mudanca medicamentosa.

**Risco:** MEDIO.

### P5: UX da tela parece checklist/prontuario

A rota `/cases/[id]/sessions/new` apresenta uma busca grande, checklist transdiagnostico, notas e outros sintomas. Para apoio medicamentoso, falta foco nas medicaçoes ativas e nos pontos de atencao.

**Impacto:**

- Usuario nao entende o raciocinio medicamentoso.
- O registro parece generico.
- Alertas aparecem como consequencia lateral, nao como valor principal.

**Risco:** MEDIO.

### P6: "Outros Sintomas" nao e persistido

O campo existe na UI, mas nao faz parte de `createSessionSchema`.

**Impacto:**

- Usuario pode digitar conteudo que sera perdido.
- Reduz confianca no produto.

**Risco:** MEDIO.

### P7: Falta observabilidade de cobertura

Nao ha relatorio indicando quantos medicamentos tem alertas estruturados, quantos sintomas sao cobertos e quantos pares foram rejeitados.

**Impacto:**

- Dificil saber se a base esta pronta para uso.
- Dificil priorizar medicamentos sem cobertura.

**Risco:** MEDIO.

---

## 🟢 Problemas Menores

### P8: Nomenclatura de UI desalinhada

"Sessao Magica", "Notas da Sessao" e "Finalizar Registro da Sessao" podem sugerir prontuario ou promessa de IA.

**Impacto:** desalinhamento de posicionamento.

**Risco:** BAIXO.

### P9: Microcopy nao explicita limitacao

Alertas devem deixar claro que nao confirmam causalidade.

**Impacto:** risco de interpretacao excessiva.

**Risco:** BAIXO.

---

## ✅ O Que Esta Bem

- O schema ja tem `medicationSymptomAlert`.
- O projeto ja tem padrao de scripts batch para IA em `src/server/db/scripts/enrichment` e `src/server/db/scripts/relevance`.
- A taxonomia de sintomas ja existe.
- As medicaçoes atuais do caso ja sao modeladas em `patientMedication`.
- O runtime ja tem uma action/query para alertas em tempo real, o que facilita trocar a implementacao.

---

## 📊 Matriz de Risco

| Problema | Severidade | Probabilidade | Risco | Esforco |
|----------|------------|---------------|-------|---------|
| P1 sem populacao estruturada | Alto | Alta | CRITICO | 4-6h |
| P2 match textual fragil | Alto | Alta | CRITICO | 2-3h |
| P3 IA direto na tabela final | Alto | Media | CRITICO | 2-3h |
| P4 observacao sem temporalidade | Medio | Alta | MEDIO | 3-5h |
| P5 UX desalinhada | Medio | Alta | MEDIO | 4-8h |
| P6 campo nao persistido | Medio | Alta | MEDIO | 1-2h |
| P7 falta cobertura/stats | Medio | Media | MEDIO | 1-2h |
| P8 nomenclatura | Baixo | Alta | BAIXO | 30min |
| P9 microcopy | Baixo | Media | BAIXO | 30min |

---

## Ordem de Fixacao

1. Criar staging de candidatos.
2. Criar batch IA para candidatos.
3. Consumir batch e salvar candidatos.
4. Aprovar/promover candidatos.
5. Alterar runtime para usar tabela final.
6. Expandir observacao da sessao para temporalidade.
7. Reorganizar UX da tela.
8. Ajustar textos e limitacoes.

---

## Proximos Passos

Comecar com um seed pequeno e verificavel:

- medicamentos com `mentalHealthRelevance >= 8`;
- top 30 a 50 sintomas mais relevantes da taxonomia;
- maximo inicial de 8 a 12 candidatos por medicamento;
- promocao manual por script, nao automatica.
