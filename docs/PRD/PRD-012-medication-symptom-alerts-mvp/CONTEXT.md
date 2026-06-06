# Context: Alertas Medicamentosos por Sintoma

**Ultima atualizacao:** 2026-05-09

---

## 📌 Definicao

Alertas medicamentosos por sintoma sao pares estruturados que indicam que um sintoma observado pode merecer atencao no contexto de uma medicacao ativa.

**O que e:**

- Uma base estruturada `medication + symptom`.
- Um apoio deterministico para destacar pontos de atencao.
- Uma forma de transformar conhecimento gerado por IA em dados auditaveis.
- Um mecanismo para orientar melhor a coleta de temporalidade e contexto.

**O que NAO e:**

- Nao e diagnostico de reacao adversa.
- Nao confirma causalidade.
- Nao substitui avaliacao medica.
- Nao recomenda iniciar, ajustar ou suspender medicacao.
- Nao e prontuario.

---

## 🔄 Fluxo Completo

```txt
medicamentos enriquecidos e sintomas internos
  ↓
script gera batch de candidatos com IA
  ↓
resposta IA e consumida em tabela de staging
  ↓
candidatos sao aprovados ou rejeitados
  ↓
pares aprovados populam medication_symptom_alert
  ↓
runtime cruza medicaçoes ativas + sintomas selecionados
  ↓
UI exibe pontos de atencao e coleta temporalidade
  ↓
sessao salva achados estruturados
```

### Etapa 1: Geracao de candidatos

O script deve selecionar medicamentos relevantes, buscar sintomas internos e pedir para a IA retornar apenas pares que fazem sentido para apoio medicamentoso observacional.

O prompt deve ser conservador:

- nao afirmar causalidade;
- nao criar sintoma fora da taxonomia;
- usar apenas `symptomId` informado;
- retornar severidade `YELLOW` ou `RED`;
- retornar contexto curto e util;
- retornar racional de mapeamento.

### Etapa 2: Staging

A saida da IA entra em uma tabela de candidatos, nao na tabela final.

Estados esperados:

```txt
PENDING
  ↓
APPROVED ou REJECTED
  ↓
SEEDED
```

### Etapa 3: Runtime

No runtime, a tela nao chama IA para decidir alerta. A regra consulta banco:

```txt
patient_medication atual
+ medication_symptom_alert
+ symptomIds selecionados
= alertas exibidos
```

### Etapa 4: UX

A usuaria seleciona sinais observados. Quando houver match estruturado, o sistema mostra um ponto de atencao contextualizado com a medicacao ativa.

Texto esperado:

```txt
Sertralina + Agitacao
Pode merecer atencao se surgiu apos inicio ou aumento recente.
```

---

## 💾 Dados Armazenados

### Modelo atual: medication_symptom_alert

```typescript
{
  medicationId: string;
  symptomId: string;
  severity: "YELLOW" | "RED";
  context?: string;
}
```

### Modelo proposto: medication_symptom_alert_candidate

```typescript
{
  id: string;
  medicationId: string;
  symptomId: string;
  severity: "YELLOW" | "RED";
  context: string;
  rationale: string;
  sourcePromptVersion: string;
  sourceModel: string;
  rawResponse: unknown;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SEEDED";
  reviewedAt?: Date;
  createdAt: Date;
}
```

### Modelo atual: session_observation

```typescript
{
  sessionId: string;
  symptomId: string;
}
```

### Modelo desejado para fase 2

```typescript
{
  sessionId: string;
  symptomId: string;
  intensity?: "MILD" | "MODERATE" | "SEVERE" | "UNKNOWN";
  course?: "NEW" | "WORSE" | "SAME" | "BETTER" | "RESOLVED" | "UNKNOWN";
  medicationTiming?: "AFTER_START" | "AFTER_INCREASE" | "AFTER_DECREASE" | "BEFORE_MEDICATION" | "UNCLEAR";
  note?: string;
}
```

---

## 🎯 Estados

### Estados do candidato

```txt
PENDING
  ↓
APPROVED
  ↓
SEEDED
```

Ou:

```txt
PENDING
  ↓
REJECTED
```

#### PENDING

- Criado por batch de IA.
- Ainda nao usado em runtime.

#### APPROVED

- Aprovado para entrar na tabela final.
- Pode ser aprovado por comando manual no MVP.

#### REJECTED

- Nao deve entrar no runtime.
- Mantido para auditoria.

#### SEEDED

- Ja foi promovido para `medication_symptom_alert`.

---

## 🔗 Integracao com Outros Dominios

### Medications → Alerts

`medication` fornece a substancia base. No MVP, os campos `attentionSignals`, `clinicalConfounders` e `coordinationNotes` podem ajudar a IA a gerar candidatos.

### Symptoms → Alerts

`symptom` e `symptomCategory` definem a taxonomia fechada. A IA nao deve criar sintomas novos no batch de candidatos.

### Cases → Runtime

`patientMedication` define quais medicamentos estao ativos em um caso. Apenas medicamentos atuais devem gerar alerta na tela.

### Sessions → Observations

`sessionObservation` registra os sintomas marcados. Na fase 2, deve registrar intensidade, curso e temporalidade para qualificar o ponto de atencao.

---

## 📊 Exemplo Real: Flow Completo

1. Medicamento: sertralina.
2. Sintoma interno: agitacao.
3. IA gera candidato:

```json
{
  "medicationId": "sertralina-id",
  "symptomId": "agitacao-id",
  "severity": "YELLOW",
  "context": "Pode merecer atencao quando agitacao surge ou piora apos inicio ou aumento recente.",
  "rationale": "Agitacao pode aparecer como sinal de ativacao em alguns pacientes."
}
```

4. Candidato e aprovado.
5. Usuario marca agitacao em paciente que usa sertralina.
6. Runtime consulta `medication_symptom_alert`.
7. UI mostra ponto de atencao e pergunta temporalidade.
8. Usuario seleciona "surgiu apos aumento".
9. Sessao salva sintoma, temporalidade e nota.

---

## 📋 Validacoes

### Input Validation

- `medicationId` deve existir em `medication`.
- `symptomId` deve existir em `symptom`.
- `severity` deve ser `YELLOW` ou `RED`.
- `context` deve ser curto, observacional e nao prescritivo.
- `status` deve seguir enum fechado.

### Business Logic Validation

- Nao promover candidato rejeitado.
- Nao promover duplicata de `medicationId + symptomId`.
- Nao exibir alerta para medicamento inativo.
- Nao chamar IA no runtime da tela.
- Nao usar linguagem de causalidade conclusiva.

---

## Resumo Tecnico

O MVP deve manter a IA fora do fluxo de decisao em tempo real. A IA gera insumos offline. O produto consome apenas dados estruturados aprovados. Isso permite evoluir a cobertura rapidamente sem perder previsibilidade no uso clinico.
