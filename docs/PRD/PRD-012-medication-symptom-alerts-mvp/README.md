# PRD-012: Medication Symptom Alerts MVP (Alertas Medicamentosos por Sintoma)

**Status:** Proposto
**Data:** 2026-05-09
**Versao:** 1.0

---

## 📋 O Que e Este PRD?

Este PRD define como popular e usar a tabela `medication_symptom_alert` no MVP da Lente Clinica, usando IA em batch para gerar candidatos e regras deterministicas em runtime para apoiar a observacao medicamentosa.

**Documento:** plano de produto e implementacao para substituir o match textual atual em `attentionSignals` por uma base estruturada de pares `medicamento + sintoma`.

**Tempo Total:** 2 a 4 dias para MVP funcional, sem revisao clinica externa completa.

---

## 📂 Estrutura do PRD

```txt
PRD-012-medication-symptom-alerts-mvp/
├── README.md (este arquivo)
├── CONTEXT.md (contexto do dominio)
├── DIAGNOSTIC.md (problemas e riscos)
├── TASKS.md (plano de implementacao)
└── QUICK_START.md (guia rapido)
```

---

## 🎯 Resumo Executivo

### Status Atual

- A tabela `medication_symptom_alert` ja existe no schema, mas nao ha evidencia de populacao ativa.
- A tela de nova sessao usa `calculateRealTimeAlertsService`, que cruza sintomas selecionados com `med.attentionSignals` por match textual.
- O MVP precisa permitir que a IA gere candidatos, mas a experiencia do usuario deve depender de regras previsiveis, auditaveis e salvas no banco.

### Severidade

| Criticos | Moderados | Menores |
|----------|-----------|---------|
| 🔴 3     | 🟡 4      | 🟢 2    |

### Ordem de Fixacao

| Fase | Tasks | Tempo |
|------|-------|-------|
| 1: Criticos | T1-T3 | 1 a 1.5 dia |
| 2: Robustez | T4-T7 | 1 a 2 dias |
| 3: Melhorias | T8-T9 | 0.5 dia |

**Total:** 2 a 4 dias

---

## 🔴 Problemas Criticos

### T1: Criar pipeline de candidatos IA para `medication_symptom_alert`

**Impacto:** sem populacao estruturada, o produto continua usando match textual fragil.
**Solucao:** criar scripts batch para gerar pares candidatos `medicationId + symptomId + severity + context`.

### T2: Criar tabela de staging para candidatos

**Impacto:** inserir saida da IA diretamente na tabela final reduz auditabilidade e aumenta risco clinico.
**Solucao:** criar `medication_symptom_alert_candidate` com status `PENDING`, `APPROVED`, `REJECTED`.

### T3: Trocar runtime para consulta deterministica

**Impacto:** a tela atual nao usa a tabela estruturada e pode perder ou inventar matches por texto.
**Solucao:** alterar `calculateRealTimeAlertsService` para cruzar medicaçoes ativas, sintomas selecionados e `medication_symptom_alert`.

---

## 🟡 Problemas Moderados

### T4: Versionar prompt e modelo dos candidatos

**Impacto:** sem versao, nao ha como explicar por que um alerta foi criado.
**Solucao:** salvar `sourceModel`, `promptVersion`, `rawResponse` e `rationale`.

### T5: Adicionar temporalidade na observacao da sessao

**Impacto:** o sistema identifica relevancia do par, mas nao captura se o sintoma surgiu antes ou depois da medicacao.
**Solucao:** expandir `session_observation` para guardar `intensity`, `course`, `medicationTiming` e nota curta.

### T6: Melhorar UX da tela de nova observacao medicamentosa

**Impacto:** a tela parece prontuario/checklist generico, nao apoio medicamentoso.
**Solucao:** organizar em etapas: medicaçoes atuais, sinais observados, pontos de atencao e revisao.

### T7: Criar relatorio de qualidade do seed

**Impacto:** populacao opaca pode gerar cobertura irregular.
**Solucao:** criar script de stats por medicamento, sintoma, severidade e status.

---

## 🟢 Problemas Menores

### T8: Renomear textos de UI

**Impacto:** termos como "Sessao Magica" e "Notas da Sessao" desviam o foco do apoio medicamentoso.
**Solucao:** usar "Nova observacao medicamentosa", "Sinais observados" e "Observacao complementar".

### T9: Documentar limitacoes clinicas no produto

**Impacto:** risco de a usuaria interpretar alerta como causalidade.
**Solucao:** microcopy: "Pode merecer atencao", "relacao incerta", "nao confirma causalidade".

---

## 💾 Arquivos Principais

- `src/server/db/schema.ts` - modelos `medication`, `symptom`, `medicationSymptomAlert`, `clinicalSession`, `sessionObservation`.
- `src/features/sessions/services/calculate-real-time-alerts.service.ts` - regra atual de alertas em tempo real.
- `src/features/sessions/forms/session-checklist-form.tsx` - UI atual de coleta de sintomas.
- `src/features/sessions/schemas/sessions.schema.ts` - schema atual de criacao de sessao.
- `src/server/db/scripts/enrichment/*` - padrao existente de batches com IA.
- `src/server/db/scripts/relevance/*` - padrao existente de geracao, envio e consumo de batches.

---

## ✅ Como Comecar

1. Ler: `CONTEXT.md`, `DIAGNOSTIC.md`, `QUICK_START.md`, `TASKS.md`
2. Criar branch: `git checkout -b feature/medication-symptom-alerts-mvp`
3. Implementar staging e scripts de candidatos
4. Popular candidatos para medicamentos mais relevantes
5. Aprovar subset inicial
6. Alterar runtime para usar `medication_symptom_alert`
7. Rodar `npm run lint`

---

## 📊 Matriz de Risco

| Task | Severidade | Probabilidade | Risco | Esforco |
|------|------------|---------------|-------|---------|
| T1 | Alto | Alta | CRITICO | 4-6h |
| T2 | Alto | Alta | CRITICO | 2-3h |
| T3 | Alto | Alta | CRITICO | 2-3h |
| T4 | Medio | Media | MEDIO | 1-2h |
| T5 | Medio | Media | MEDIO | 3-5h |
| T6 | Medio | Alta | MEDIO | 4-8h |
| T7 | Medio | Media | MEDIO | 1-2h |
| T8 | Baixo | Alta | BAIXO | 30min |
| T9 | Baixo | Media | BAIXO | 30min |

---

**Status:** pronto para refinamento tecnico e execucao incremental.
